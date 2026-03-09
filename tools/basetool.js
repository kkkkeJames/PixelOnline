export class BaseTool {
  constructor() {
    this.toolIndex = 0;
  }
  onSelect() {
    document.querySelectorAll("#lefttoolbar .button").forEach(x => {
      if (x.getAttribute("tool_index") == this.toolIndex) x.style.backgroundColor = "";
      else x.style.backgroundColor = "#d0d0d0";
    });
  }
  onDeselect() {}
  onMouseDown(pos) {}
  onWindowMouseMove(pos) {}
  onMouseMove(pos) {}
  onMouseUp(pos) {}
}