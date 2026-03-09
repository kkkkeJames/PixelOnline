import { BaseTool } from "./basetool.js";
import { ToolManager } from "../toolmanager.js";

const viewport = document.getElementById('viewport');
let X = 0;
let Y = 0;
let lastX = 0;
let lastY = 0;

export class Hand extends BaseTool {
  constructor() {
    super();
    this.drawing = false;
    this.toolIndex = 3;
  }

  onMouseDown(pos) {
    this.drawing = true;
    lastX = pos.x;
    lastY = pos.y;
  }

  onWindowMouseMove(pos) {
    if (this.drawing) {
      X += pos.x - lastX;
      Y += pos.y - lastY;
      lastX = pos.x;
      lastY = pos.y;  
      viewport.style.transform = `translate(${X}px, ${Y}px)`;
    }    
  }

  onMouseUp(pos) {
    this.drawing = false;
  }
}
