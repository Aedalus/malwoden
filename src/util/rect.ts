export interface IRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class Rect {
  readonly x1: number;
  readonly x2: number;
  readonly y1: number;
  readonly y2: number;

  static fromWidthHeight(x: number, y: number, width: number, height: number): Rect {
    return new Rect({
      x1: x,
      y1: y,
      x2: x + width,
      y2: y + height,
    });
  }

  constructor(points: IRect) {
    this.x1 = points.x1;
    this.y1 = points.y1;
    this.x2 = points.x2;
    this.y2 = points.y2;
  }

  width(): number {
    return this.x2 - this.x1;
  }
  height(): number {
    return this.y2 - this.y1;
  }
  intersects(rect: IRect): boolean {
    if (this.x1 > rect.x2 || rect.x1 > this.x2) return false;
    if (this.y1 > rect.y2 || rect.y1 > this.y2) return false;

    return true;
  }
}
