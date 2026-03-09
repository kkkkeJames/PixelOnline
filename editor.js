import { Project } from "./project.js"
import "./render.js"

export const editor = {
  // The project data, always of Project class. Used as backend pixel storage, grant access to complex algorithms, posted to backend canvas.
  project: null,
  /* The frontend canvas, the pipeline for rendering to the screen
  viewcanvas get the viewcanvas element of the same ID in index.html
  viewctx is the 2D content of viewcanvas, a canvas object */
  viewcanvas: document.getElementById('viewcanvas'),
  viewctx: null,
  // Similarly, a UI canvas and its context purely for drawing UI
  cursorcanvas: document.getElementById('cursorcanvas'),
  cursorctx: null,
  // The integer scale of the frontend canvas, only controlling the size of one pixel while rendering, does not affect the actual value of project
  viewscale: 1,
  /* Those are current color picked/current alpha set
  current color picked is only rgb, 0x000000, current alpha set is only a, eventually encoded as 0x00 */
  currentColor: 0x000000,
  currentAlpha: 0xff,
  // Initialize viewctx and cursorctx
  init() {
    this.viewctx = this.viewcanvas.getContext('2d');
    this.viewctx.imageSmoothingEnabled = false;
    this.cursorctx = this.cursorcanvas.getContext('2d');
    this.cursorctx.imageSmoothingEnabled = false;
  },
  // Clear the project, resulting in a canvas of w * h, all transparent (white)
  // It always set a new blank project, so it should always be called when starting
  newProject(width, height) {
    this.project = new Project(width, height);
    this.project.pixels.fill(0x00000000);
  },

  // The function to set the view scale. Always set the canvas for drawing cursor and other stuff be as the client rect
  setViewScale(scale) {
    this.viewscale = scale;
    this.viewcanvas.style.width = this.project.width * scale * 2 + 'px';
    this.viewcanvas.style.height = this.project.height * scale * 2 + 'px';
    const rect = editor.viewcanvas.getBoundingClientRect();
    editor.cursorcanvas.width = rect.width;
    editor.cursorcanvas.height = rect.height;
    editor.cursorcanvas.style.width = rect.width + 'px';
    editor.cursorcanvas.style.height = rect.height + 'px';
  }
};