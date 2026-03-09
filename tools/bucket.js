import { BaseTool } from "./basetool.js";
import { editor } from "../editor.js";
import { render, renderBrushedRegion } from "../render.js";
import { ToolManager } from "../toolmanager.js";

export class Bucket extends BaseTool {
  constructor() {
    super();
    this.toolIndex = 2;
  }

  onMouseDown(pos) {
    this.paintBucket(pos);
  }

  paintBucket(pos) {
    const p = editor.project;
    const bucketColor = ((editor.currentAlpha << 24) | editor.currentColor) >>> 0;
    const startX = pos.x;
    const startY = pos.y;
    const w = p.width;
    const h = p.height;
    const index = startY * w + startX;
    if (p.pixels[index] == bucketColor) return;
    const origColor = p.pixels[index];
    const stack = [];
    stack.push({ x: startX, y: startY });
    while (stack.length > 0) {
      const { x, y } = stack.pop();
      const i = y * w + x;
      if (p.pixels[i] != origColor) continue;
      p.pixels[i] = bucketColor;
      if (x > 0) stack.push({ x: x - 1, y });
      if (x < w - 1) stack.push({ x: x + 1, y });
      if (y > 0) stack.push({ x, y: y - 1 });
      if (y < h - 1) stack.push({ x, y: y + 1 });
    }
    render();
  }
}
