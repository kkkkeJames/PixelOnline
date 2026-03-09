// A tool manager system. Holds currentTool for the current tool. If mouse moves detected, directs to the mouse moves of the current tool.
export const ToolManager = {
  // The current tool
  currentTool: null,
  // The scale of tool, from 1 to 10
  toolScale: 1,

  set(tool) {
    if (this.currentTool?.onDeselect) {
      this.currentTool.onDeselect();
    }
    this.currentTool = tool;
    tool.onSelect?.();
  },

  onMouseDown(pos) {
    this.currentTool?.onMouseDown?.(pos);
  },

  onWindowMouseMove(pos) {
    this.currentTool?.onWindowMouseMove?.(pos);
  },

  onMouseMove(pos) {
    this.currentTool?.onMouseMove?.(pos);
  },

  onMouseUp(pos) {
    this.currentTool?.onMouseUp?.(pos);
  }
};

document.getElementById('brushscale').oninput = e => {
  ToolManager.toolScale = e.target.value;
};