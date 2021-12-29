import { Vector2 } from "./vector";

/** Represents a basic rectangle. */
export class Rect {
  readonly v1: Vector2;
  readonly v2: Vector2;

  /**
   * Creates a rectangle. Will internally set v1 to the min
   * coordinate corder, and v2 to the max corner.
   *
   * @param v1 - A vector representing one of the corners
   * @param v2 - A vector representing the other corner
   */
  constructor(v1: Vector2, v2: Vector2) {
    this.v1 = {
      x: Math.min(v1.x, v2.x),
      y: Math.min(v1.y, v2.y),
    };
    this.v2 = {
      x: Math.max(v1.x, v2.x),
      y: Math.max(v1.y, v2.y),
    };
  }

  width(): number {
    return Math.abs(this.v2.x - this.v1.x) + 1;
  }

  height(): number {
    return Math.abs(this.v2.y - this.v1.y) + 1;
  }

  center(): Vector2 {
    return {
      x: Math.round((this.v1.x + this.v2.x - 1) / 2),
      y: Math.round((this.v1.y + this.v2.y - 1) / 2),
    };
  }

  intersects(rect: Rect): boolean {
    if (this.v1.x > rect.v2.x || rect.v1.x > this.v2.x) return false;
    if (this.v1.y > rect.v2.y || rect.v1.y > this.v2.y) return false;

    return true;
  }
}
