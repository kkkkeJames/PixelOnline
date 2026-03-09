import { editor } from './editor.js';

const sliders = {};
// The class of color sliders, including the channel that the color slider is representing, and value that should be passed to the editor's color
class ColorSlider {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.channel = canvas.getAttribute("channel");
    this.value = 0;
    if (this.channel == "#00000000") this.value = 255;
    this.drawing = false;
    this.bindEvents();
    this.draw();
  }

  bindEvents() {
    this.canvas.addEventListener("mousedown", e => {
      this.drawing = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      this.value = Math.round(x / rect.width * 255);
      if (this.value < 0) this.value = 0;
      if (this.value > 255) this.value = 255;
      this.obtainColor();
    });
    window.addEventListener("mousemove", e => {
      if (this.drawing) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        this.value = Math.round(x / rect.width * 255);
        if (this.value < 0) this.value = 0;
        if (this.value > 255) this.value = 255;
        this.obtainColor();
      }
    });
    window.addEventListener("mouseup", e => {
      this.drawing = false;
    })
  }

  obtainColor() {
    switch (this.channel){
      case "#ff0000":
        r = this.value;
        break;
      case "#00ff00":
        g = this.value;
        break;
      case "#0000ff":
        b = this.value;
        break;
      case "#00000000":
        a = this.value;
        break;
    }
    modifyColor();
    this.draw();
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (this.channel == "#00000000") {
      g.addColorStop(0, this.channel);
      g.addColorStop(1, "black");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const x = this.value / 255 * canvas.width;
      ctx.fillStyle = "white";
      ctx.fillRect(x - 1, 0, 3, canvas.height);
    }
    else {
      g.addColorStop(0, "black");
      g.addColorStop(1, this.channel);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const x = this.value / 255 * canvas.width;
      ctx.fillStyle = "white";
      ctx.fillRect(x - 1, 0, 3, canvas.height);
    }
  }
}

// Create a new class for each slider
document.querySelectorAll(".color-slider").forEach(canvas => {
  const channel = canvas.getAttribute("channel");
  sliders[channel] = new ColorSlider(canvas);
});

document.getElementById('Rchannel').oninput = e => {
  r = e.target.value;
  sliders["#ff0000"].value = r;
  sliders["#ff0000"].draw();
  modifyColor();
};

document.getElementById('Gchannel').oninput = e => {
  g = e.target.value;
  sliders["#00ff00"].value = g;
  sliders["#00ff00"].draw();
  modifyColor();
};

document.getElementById('Bchannel').oninput = e => {
  b = e.target.value;
  sliders["#0000ff"].value = b;
  sliders["#0000ff"].draw();
  modifyColor();
};

document.getElementById('Achannel').oninput = e => {
  a = e.target.value;
  sliders["#00000000"].value = a;
  sliders["#00000000"].draw();
  modifyColor();
};

// Modify the editor's color through color channels
let r = 0, g = 0, b = 0, a = 255;
function modifyColor() {
  editor.currentColor = (b<<16)|(g<<8)|r;
  editor.currentAlpha = a;
  document.getElementById('Rchannel').value = r;
  document.getElementById('Gchannel').value = g;
  document.getElementById('Bchannel').value = b;
  document.getElementById('Achannel').value = a;
}