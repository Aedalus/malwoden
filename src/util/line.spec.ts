import { Line } from "./line";

describe("line", () => {
  it("can create a new line", () => {
    const line = new Line(1, 1, 2, 2);

    expect(line.x1).toBe(1);
    expect(line.y1).toBe(1);

    expect(line.x2).toBe(2);
    expect(line.y2).toBe(2);

    expect(line.getDeltaX()).toBe(1);
    expect(line.getDeltaY()).toBe(1);
  });

  it("can clone a line", () => {
    const line = new Line(1, 2, 3, 4);
    const cloned = line.clone();

    expect(line.x1).toEqual(cloned.x1);
    expect(line.x2).toEqual(cloned.x2);

    expect(line.y1).toEqual(cloned.y1);
    expect(line.y2).toEqual(cloned.y2);
  });

  it("can calculate collinear points", () => {
    const line = new Line(1, 1, 2, 2);

    // Valid test cases
    const collinearPoints = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];

    for (let v of collinearPoints) {
      expect(line.isCollinear(v.x, v.y)).toBeTruthy();
      expect(line.isAboveOrCollinear(v.x, v.y)).toBeTruthy();
      expect(line.isBelowOrCollinear(v.x, v.y)).toBeTruthy();
    }

    for (let v of collinearPoints) {
      expect(line.isAbove(v.x, v.y)).toBeFalsy();
      expect(line.isBelow(v.x, v.y)).toBeFalsy();
    }
  });

  it("can calculate points above", () => {
    const line = new Line(1, 1, 2, 2);

    const abovePoints = [
      { x: 2, y: 3 },
      { x: 4, y: 100 },
      { x: -4, y: -3 },
    ];
    for (let v of abovePoints) {
      expect(line.isBelow(v.x, v.y)).toBeTruthy();
      expect(line.isBelowOrCollinear(v.x, v.y)).toBeTruthy();

      expect(line.isAbove(v.x, v.y)).toBeFalsy();
      expect(line.isAboveOrCollinear(v.x, v.y)).toBeFalsy();
      expect(line.isCollinear(v.x, v.y)).toBeFalsy();
    }
  });
});
