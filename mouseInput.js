// This manages the input from mouse through directly calling tool manager. 
// It is quite a immature way, but through making normal functions (like dragging/selecting a region) tools, this system could be an all-rounder
import { editor } from "./editor.js";
import { ToolManager } from "./toolmanager.js";
const viewport = document.getElementById('viewport');
// This function should be called if and only if e is input from mouse
function getPixelPos(e) {
  const p = editor.project;
  if (!p) return;
  const rect = editor.viewcanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / rect.width * editor.project.width);
  const y = Math.floor((e.clientY - rect.top) / rect.height * editor.project.height);
  return {x, y};
}
editor.viewcanvas.addEventListener("mousedown", e => {
  ToolManager.onMouseDown(getPixelPos(e));
});
window.addEventListener("mousemove", e => {
  ToolManager.onWindowMouseMove(getPixelPos(e));
});
editor.viewcanvas.addEventListener("mousemove", e => {
  ToolManager.onMouseMove(getPixelPos(e));
});
window.addEventListener("mouseup", e => {
  ToolManager.onMouseUp();
});

// Detect mouse wheel
editor.viewcanvas.addEventListener("wheel", e => {
  if (e.deltaY < 0) {
    modify_viewscale(true);
    editor.setViewScale(editor.viewscale);
  } else {
    modify_viewscale(false);
    editor.setViewScale(editor.viewscale);
  }
});

function modify_viewscale (scroll_up){
  if (scroll_up == true)
  {
    if (editor.viewscale < 0.5)
      editor.viewscale += 0.125;
    else if (editor.viewscale >= 0.5 && editor.viewscale < 1)
      editor.viewscale += 0.25;
    else if (editor.viewscale >= 1 && editor.viewscale < 10) {
      editor.viewscale += 1;
    }
    else return;
  }
  else 
  {
    if (editor.viewscale > 0.125 && editor.viewscale <= 0.5)
      editor.viewscale -= 0.125;
    else if (editor.viewscale > 0.5 && editor.viewscale <= 1)
      editor.viewscale -= 0.25;
    else if (editor.viewscale > 1 && editor.viewscale <= 10) {
      editor.viewscale -= 1;
    }
    else return;
  }
}