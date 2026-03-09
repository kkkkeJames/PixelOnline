import { editor } from './editor.js';

/* A backend canvas, used for storing of backend data, rendered to the viewcanvas if required
Push all data on backcanvas and render it onto the screen to avoid directly modifying frontend canvas, which has potential blink issues
It only stores backend data, do not modify it directly */
const backcanvas = document.createElement('canvas');
const backctx = backcanvas.getContext('2d', { willReadFrequently: true });

export function render() {
  // Get the project. Return if there is no stuff in project.
  const project = editor.project;
  if (!project) return;
  // Set the width and height of the backend canvas 
  backcanvas.width = project.width;
  backcanvas.height = project.height;
  // Create a new image data under context of backend canvas with specified width and height, obtain its data for storing pixels 
  const img = backctx.createImageData(project.width, project.height);
  const data = img.data;
  // Set the data in project.pixels to backImageData, so to backend canvas
  for (let i = 0; i < project.pixels.length; i++) {
    const c = project.pixels[i];
    data[i*4 + 0] = c & 255;
    data[i*4 + 1] = (c >> 8) & 255;
    data[i*4 + 2] = (c >> 16) & 255;
    data[i*4 + 3] = (c >> 24) & 255;
  }
  // Put the data onto the canvas
  backctx.putImageData(img, 0, 0);
  // Now viewcanvas, the frontend canvas
  // Set the width and height of the frontend canvas 
  const vc = editor.viewcanvas;
  vc.width = project.width;
  vc.height = project.height;
  // Reset view scale
  editor.setViewScale(editor.viewscale);
  // Now get all the data of the backend canvas to the frontend canvas
  editor.viewctx.clearRect(0, 0, vc.width, vc.height);
  editor.viewctx.drawImage(backcanvas, 0, 0);
}

// Render the image after drawing some pixels. It uses putImageData with a width * height pixel change, and its only difference is less time complexity
export function renderBrushedRegion(x, y, width, height) {
  const project = editor.project;
  // Return if there is no project
  if (!project) return;
  // Create a new image data under context of backend canvas with specified width and height, obtain its data for storing pixels 
  const img = backctx.createImageData(width, height);
  const data = img.data;
  let count = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const c = project.pixels[(y + j) * project.width + (x + i)];
      data[count*4+0] = c & 255;
      data[count*4+1] = (c >> 8) & 255;
      data[count*4+2] = (c >> 16) & 255;
      data[count*4+3] = (c >> 24) & 255;
      count++;
    }
  }
  // Put the data onto the canvas
  backctx.putImageData(img, x, y);
  // Get all the data of the backend canvas to the frontend canvas
  const vc = editor.viewcanvas;
  editor.viewctx.clearRect(0, 0, vc.width, vc.height);
  editor.viewctx.drawImage(backcanvas, 0, 0);
}

// Import image
export function importImage(img) {
  const temp = document.createElement('canvas');
  temp.width = img.width;
  temp.height = img.height;
  const tctx = temp.getContext('2d', { willReadFrequently: true });
  tctx.drawImage(img, 0, 0);

  const src = tctx.getImageData(0, 0, img.width, img.height).data;

  editor.newProject(img.width, img.height);
  // Loop through all pixels of the image and pass the rgb channel to their corresponding pixels
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      const i = (y * img.width + x) * 4;
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const a = src[i + 3];
      editor.project.pixels[y * img.width + x] = (a << 24) | (b << 16) | (g << 8) | r;
    }
  }

  render();
}