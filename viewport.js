const viewport = document.getElementById('viewport');
viewport.style.transform = 'translate(${viewport.x}px, ${viewport.y}px)';

let dragging = false;
let lastX = 0;
let lastY = 0;
viewport.addEventListener("mousedown", e => {
  if (e.button == 1) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
});

window.addEventListener("mousemove", e => {
  if (!dragging) return;

  viewport.x += e.clientX - lastX;
  viewport.y += e.clientY - lastY;

  lastX = e.clientX;
  lastY = e.clientY;

  viewport.style.transform = 'translate(${viewport.x}px, ${viewport.y}px)';
});

window.addEventListener("mouseup", () => {
  dragging = false;
});