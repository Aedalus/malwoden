import { Vector2 } from "./vector";

export class Line {
  private _v1: Vector2;
  private _v2: Vector2;

  get v1() {
    return this._v1;
  }

  get v2() {
    return this._v2;
  }

  set v1(val) {
    this._v1 = val;
    this.calcDeltas();
  }

  set v2(val) {
    this._v2 = val;
    this.calcDeltas();
  }

  private dx: number = 0;
  private dy: number = 0;

  constructor(v1: Vector2, v2: Vector2) {
    this._v1 = v1;
    this._v2 = v2;

    this.calcDeltas();
  }

  private calcDeltas() {
    this.dx = this._v2.x - this.v1.x;
    this.dy = this._v2.y - this.v1.y;
  }

  clone(): Line {
    return new Line({ ...this._v1 }, { ...this._v2 });
  }

  getDeltaX() {
    return this.dx;
  }

  getDeltaY() {
    return this.dy;
  }

  isBelow(x: number, y: number) {
    return this.calculateRelativeSlope(x, y) > 0;
  }

  isBelowOrCollinear(x: number, y: number) {
    return this.calculateRelativeSlope(x, y) >= 0;
  }

  isAbove(x: number, y: number) {
    return this.calculateRelativeSlope(x, y) < 0;
  }

  isAboveOrCollinear(x: number, y: number) {
    return this.calculateRelativeSlope(x, y) <= 0;
  }

  isCollinear(x: number, y: number) {
    return this.calculateRelativeSlope(x, y) === 0;
  }

  isLineCollinear(line: Line) {
    return (
      this.isCollinear(line.v1.x, line.v1.y) &&
      this.isCollinear(line.v2.x, line.v2.y)
    );
  }

  calculateRelativeSlope(x: number, y: number): number {
    return this.dy * (this.v2.x - x) - this.dx * (this.v2.y - y);
  }
}
