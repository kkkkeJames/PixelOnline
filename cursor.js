import { editor } from './editor.js';

const CURSOR_SIZE = 6; 

function drawCrosshair(x, y) {
  const ctx = editor.cursorctx;
  ctx.clearRect(0, 0, editor.cursorcanvas.width, editor.cursorcanvas.height);
  x = Math.round(x);
  y = Math.round(y);
  for (let i = -CURSOR_SIZE; i <= CURSOR_SIZE; i++)
  {
    if (getPixelColor(screenToPixel(x + i, y)) == parseStringColor('#ffffff'))
      ctx.fillStyle = '#000000';
    else ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + i, y, 1, 1);
  }
  for (let i = -CURSOR_SIZE; i <= CURSOR_SIZE; i++)
  {
    if (getPixelColor(screenToPixel(x, y + i)) == parseStringColor('#ffffff'))
      ctx.fillStyle = '#000000';
    else ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y + i, 1, 1);
  }
}

editor.viewcanvas.addEventListener("mousemove", e => {
  const rect = editor.viewcanvas.getBoundingClientRect();
  const scaleX = editor.cursorcanvas.width / rect.width;
  const scaleY = editor.cursorcanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  drawCrosshair(x, y);
});

editor.viewcanvas.addEventListener("mouseleave", () => {
  editor.cursorctx.clearRect(0, 0, editor.cursorcanvas.width, editor.cursorcanvas.height);
});

function screenToPixel(clientX, clientY) {
  const rect = editor.viewcanvas.getBoundingClientRect();
  const sx = clientX / rect.width * editor.project.width;
  const sy = clientY / rect.height * editor.project.height;
  if (sx < 0 || sy < 0 || sx >= editor.project.width || sx >= editor.project.height) 
    return null;
  return { x: Math.round(sx), y: Math.round(sy) };
}

// Returns a string of a 16 bit number
function getPixelColor(input) {
  if (input == null) return null;
  const i = input.y * editor.project.width + input.x;
  const color = editor.project.pixels[i];
  const r = color & 255;
  const g = (color >> 8) & 255;
  const b = (color >> 16) & 255;
  return (b<<16)|(g<<8)|r;
}

function parseStringColor(input) {
  const r = parseInt(input.slice(1,3),16);
  const g = parseInt(input.slice(3,5),16);
  const b = parseInt(input.slice(5,7),16);
  return (b<<16)|(g<<8)|r;
}