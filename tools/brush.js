import { BaseTool } from "./basetool.js";
import { editor } from "../editor.js";
import { renderBrushedRegion } from "../render.js";
import { ToolManager } from "../toolmanager.js";

export class Brush extends BaseTool {
  constructor() {
    super();
    this.drawing = false;
    this.toolIndex = 0;
  }

  onMouseDown(pos) {
    this.draw(pos);
    this.drawing = true;
  }

  onMouseMove(pos) {
    if (this.drawing) {
      this.draw(pos);
    }    
  }

  onMouseUp(pos) {
    this.drawing = false;
  }

  draw(pos) {
    const p = editor.project;
    const x = pos.x;
    const y = pos.y;
    if (x < 0 || y < 0 || x >= p.width || y >= p.height) return;
    const range = Math.floor(ToolManager.toolScale / 2);
    const negrange = -(ToolManager.toolScale - range - 1);
    for (let i = negrange; i <= range; i++) {
      for (let j = negrange; j <= range; j++) {
        if (x + i < 0 || y + j < 0 || x + i >= p.width || y + j >= p.height) continue;
          p.pixels[(y + j) * p.width + (x + i)] = (editor.currentAlpha << 24) | editor.currentColor;
      }
    }
    renderBrushedRegion(x + negrange, y + negrange, ToolManager.toolScale, ToolManager.toolScale);
  }
}
