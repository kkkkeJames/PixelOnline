// A Project class, storing width, height and pixels for quick data manipulation
export class Project {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint32Array(width * height); // pixel data
  }
}

export function copyProject(p) {
  const q = new Project(p.width, p.height);
  q.pixels.set(p.pixels);
  return q;
}