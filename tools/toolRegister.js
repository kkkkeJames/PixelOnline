import { Brush } from "./brush.js";
import { Eraser } from "./eraser.js";
import { Bucket } from "./bucket.js";
import { Hand } from "./hand.js";

export const Tools = {
  0: new Brush(),
  1: new Eraser(),
  2: new Bucket(),
  3: new Hand(),
};
