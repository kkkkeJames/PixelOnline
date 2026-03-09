import { editor } from './editor.js';
import { render, importImage } from './render.js';
import { Tools } from "./tools/toolRegister.js";
import { ToolManager } from "./toolmanager.js";

document.querySelectorAll("[tool_index]").forEach(btn => {
  btn.onclick = () => {
    const id = btn.getAttribute("tool_index");
    ToolManager.set(Tools[id]);
  };
});

// Detect button pressed, and whiten its background color if a button is pressed, modify its background color back if that button is released
let pressedbutton = null;
document.addEventListener("mousedown", e => {
  const btn = e.target.closest(".button");
  if (!btn) return;
  pressedbutton = btn;
  btn.style.backgroundColor = "";
});
document.addEventListener("mouseup", e => {
  if (pressedbutton != null)
  {
    pressedbutton.style.backgroundColor = "#d0d0d0";
    pressedbutton = null;
  }
});

const uploadButton = document.getElementById("uploadButton");
uploadButton.onclick = () => {
  document.getElementById('imageInput').click();
};
// on change of imageInput
document.getElementById('imageInput').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => importImage(img);
  img.src = URL.createObjectURL(file);
};

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener('click', () => {
    const dataURL = editor.viewcanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'new_image.png';
    a.click();
});

// Button of clear, if pressed, fill the whole project with transparent white
document.getElementById('clearButton').onclick = () => {
  const project = editor.project;
  if (!project) return;
  editor.newProject(512, 512);
  render();
};