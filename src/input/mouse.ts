import { Vector2 } from "../util";

export class MouseHandler {
  private x: number = 0;
  private y: number = 0;

  constructor() {
    document.addEventListener(
      "mousemove",
      this.onMouseUpdate.bind(this),
      false
    );
    document.addEventListener(
      "mouseenter",
      this.onMouseUpdate.bind(this),
      false
    );
  }

  private onMouseUpdate(e: MouseEvent) {
    this.x = e.pageX;
    this.y = e.pageY;
  }

  getPos(): Vector2 {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
