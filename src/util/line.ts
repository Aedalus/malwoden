export class Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;

  private dx: number = 0;
  private dy: number = 0;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.calcDeltas();
  }

  private calcDeltas() {
    this.dx = this.x2 - this.x1;
    this.dy = this.y2 - this.y1;
  }

  clone(): Line {
    return new Line(this.x1, this.y1, this.x2, this.y2);
  }

  getDeltaX() {
    return this.dx;
  }

  getDeltaY() {
    return this.dy;
  }

  setFirstPoint(x1: number, y1: number) {
    this.x1 = x1;
    this.y1 = y1;

    this.calcDeltas();
  }

  setSecondPoint(x2: number, y2: number) {
    this.x2 = x2;
    this.y2 = y2;

    this.calcDeltas();
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
      this.isCollinear(line.x1, line.y1) && this.isCollinear(line.x2, line.y2)
    );
  }

  calculateRelativeSlope(x: number, y: number): number {
    return this.dy * (this.x2 - x) - this.dx * (this.y2 - y);
  }
}
