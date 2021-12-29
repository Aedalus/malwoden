import { Line } from "./line";

describe("line", () => {
  it("can create a new line", () => {
    const line = new Line({ x: 1, y: 1 }, { x: 2, y: 2 });

    expect(line.v1).toEqual({ x: 1, y: 1 });
    expect(line.v2).toEqual({ x: 2, y: 2 });

    expect(line.getDeltaX()).toBe(1);
    expect(line.getDeltaY()).toBe(1);
  });

  it("can set new points", () => {
    const line = new Line({ x: 1, y: 1 }, { x: 2, y: 2 });

    expect(line.getDeltaX()).toBe(1);
    expect(line.getDeltaY()).toBe(1);

    line.v1 = { x: 3, y: 3 };
    line.v2 = { x: 5, y: 5 };

    expect(line.getDeltaX()).toBe(2);
    expect(line.getDeltaY()).toBe(2);
  });

  it("can clone a line", () => {
    const line = new Line({ x: 1, y: 2 }, { x: 3, y: 4 });
    const cloned = line.clone();

    expect(line.v1).toEqual(cloned.v1);
    expect(line.v2).toEqual(cloned.v2);
  });

  it("can calculate collinear points", () => {
    const line = new Line({ x: 1, y: 1 }, { x: 2, y: 2 });

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

  it("can calculate collinear lines", () => {
    const lineA = new Line({ x: 0, y: 0 }, { x: 1, y: 1 });
    const lineB = new Line({ x: 1, y: 1 }, { x: 3, y: 3 });

    expect(lineA.isLineCollinear(lineB)).toBeTruthy();
  });

  it("can calculate points above", () => {
    const line = new Line({ x: 1, y: 1 }, { x: 2, y: 2 });

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
