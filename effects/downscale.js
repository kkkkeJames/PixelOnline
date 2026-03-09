import { editor } from '../editor.js';
import { copyProject, Project } from '../project.js';
import { render } from '../render.js';

const Vmax = Math.sqrt(3 * 255 * 255);

let bfScale = 2;
// Applying box filtere to the project image
function BoxFilter(project, scale = 1) 
{   
    const p = project;
    let newWidth = Math.floor(p.width / scale);
    let newHeight = Math.floor(p.height / scale);
    let newPixels = new Uint32Array(newWidth * newHeight);
    for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
            let colStart = x * scale;
            let rowStart = y * scale;
            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            for (let dx = 0; dx < scale; dx++) {
                for (let dy = 0; dy < scale; dy++) {
                    let yy = rowStart + dy;
                    let xx = colStart + dx;
                    let pixel = p.pixels[yy * p.width + xx];
                    sumR += pixel & 255;
                    sumG += (pixel >> 8) & 255;
                    sumB += (pixel >> 16) & 255;
                    sumA += (pixel >> 24) & 255;
                }
            }
            sumR = sumR / (scale * scale);
            sumG = sumG / (scale * scale);
            sumB = sumB / (scale * scale);
            sumA = sumA / (scale * scale);
            newPixels[y * newWidth + x] = (sumA << 24) | (sumB << 16) | (sumG << 8) | sumR;
        }
    }
    p.width = newWidth;
    p.height = newHeight;
    p.pixels = newPixels;
    return p;
}

// Button of box filter
document.getElementById('bfButton').onclick = () => {
  let p = editor.project;
  editor.project = BoxFilter(p, bfScale);
  render();
};

document.getElementById('bfScale').oninput = e => {
  bfScale = e.target.value;
};

// Applying Gauss Kernel
function GaussKernel(project) 
{   
    const p = project;
    let newPixels = new Uint32Array(p.width * p.height);
    for (let x = 0; x < p.width; x++) {
        for (let y = 0; y < p.height; y++) {
            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    let newy = y + dy;
                    let newx = x + dx;
                    if (newx == -1) newx = 1;
                    if (newy == -1) newy = 1;
                    if (newx == p.width) newx = p.width - 2;
                    if (newy == p.height) newy = p.height - 2;
                    if (p.width == 1) newx = 0;
                    if (p.height == 2) newy = 0;
                    let scale = 1;
                    if (dx == 0 && dy == 0) scale = 4;
                    else if (dx == 0 || dy == 0) scale = 2;
                    else scale = 1;
                    let pixel = p.pixels[newy * p.width + newx];
                    sumR += scale * (pixel & 255);
                    sumG += scale * ((pixel >> 8) & 255);
                    sumB += scale * ((pixel >> 16) & 255);
                    sumA += scale * ((pixel >> 24) & 255);
                }
            }
            sumR = sumR / 16;
            sumG = sumG / 16;
            sumB = sumB / 16;
            sumA = sumA / 16;
            newPixels[y * p.width + x] = (sumA << 24) | (sumB << 16) | (sumG << 8) | sumR;
        }
    }
    p.pixels = newPixels;
    return p;
}

// Button of gauss kernel
document.getElementById('gkButton').onclick = () => {
  let p = editor.project;
  editor.project = GaussKernel(p);
  render();
};

let DPIDScale = 2;

function DPID(inputProject, guideProject, scale = 1, lambda = 0)
{
    const outWidth  = guideProject.width;
    const outHeight = guideProject.height;
    const output = new Project(outWidth, outHeight);

    for (let y = 0; y < guideProject.height; y++) {
        for (let x = 0; x < guideProject.width; x++) {
            let kp = 0.0;
            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            const guidePixel = guideProject.pixels[y * guideProject.width + x];
            const guideR = guidePixel & 255;
            const guideG = (guidePixel >> 8) & 255;
            const guideB = (guidePixel >> 16) & 255;
            for (let dy = 0; dy < scale; dy++) {
                for (let dx = 0; dx < scale; dx++) {
                    const newY = y * scale + dy;
                    const newX = x * scale + dx;
                    const inputPixel = inputProject.pixels[newY * inputProject.width + newX];
                    const inputR = inputPixel & 255;
                    const inputG = (inputPixel >> 8) & 255;
                    const inputB = (inputPixel >> 16) & 255;
                    const inputA = (inputPixel >> 24) & 255;
                    const dr = inputR - guideR;
                    const dg = inputG - guideG;
                    const db = inputB - guideB;
                    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
                    const addup = Math.pow(dist / Vmax, lambda);
                    kp += addup;
                    sumR += inputR * addup;
                    sumG += inputG * addup;
                    sumB += inputB * addup;
                    sumA += inputA;
                }
            }
            const outR = sumR / kp;
            const outG = sumG / kp;
            const outB = sumB / kp;
            const outA = sumA / (scale * scale);
            const outPixel = (outA << 24) | (outB << 16) | (outG << 8) | outR;
            output.pixels[y * outWidth + x] = outPixel;
        }
    }
    return output;
}

document.getElementById('DPIDButton').onclick = () => {
  let newproject1 = copyProject(editor.project);
  let newproject2 = copyProject(editor.project);
  editor.project = DPID(newproject2, GaussKernel(BoxFilter(newproject1, DPIDScale)), DPIDScale);
  render();
};

document.getElementById('DPIDScale').oninput = e => {
  DPIDScale = e.target.value;
};