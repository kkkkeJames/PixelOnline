import { editor } from './editor.js';
import { render } from './render.js';
import { ToolManager } from "./toolmanager.js";
import { Tools } from "./tools/toolRegister.js";
import './colorslider.js';
import './ui.js';
import './cursor.js';
import './mouseInput.js';
import './effects/downscale.js';

editor.init();
editor.newProject(512, 512);
render();
ToolManager.set(Tools[0]); 