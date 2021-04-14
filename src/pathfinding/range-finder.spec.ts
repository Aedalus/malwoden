import { Vector } from "../calc";
import { RangeFinder } from "./range-finder";

describe("range-finder", () => {
  it("can create a new RangeFinder", () => {
    const distanceFunc = () => 1.5;
    const rf = new RangeFinder({
      topology: "four",
      getDistanceCallback: distanceFunc,
    });
    expect(rf).not.toBeUndefined();
    expect(rf["getDistance"]).toBe(distanceFunc);
  });

  it("can get a range of 0", () => {
    const rf = new RangeFinder({
      topology: "eight",
    });
    const range = rf.compute({
      start: { x: 0, y: 0 },
      maxRange: 0,
    });
    expect(range).toEqual([{ x: 0, y: 0, r: 0 }]);
  });

  it("can get a range of (1,2) - topology four", () => {
    const rf = new RangeFinder({
      topology: "four",
    });
    const range = rf.compute({
      start: { x: 0, y: 0 },
      maxRange: 2,
      minRange: 1,
    });
    expect(range).toHaveLength(12);
    expect(range).toEqual([
      // gen 1
      { x: 1, y: 0, r: 1 },
      { x: 0, y: -1, r: 1 },
      { x: -1, y: 0, r: 1 },
      { x: 0, y: 1, r: 1 },

      // gen 2
      { x: 2, y: 0, r: 2 },
      { x: 1, y: -1, r: 2 },
      { x: 1, y: 1, r: 2 },
      { x: 0, y: -2, r: 2 },
      { x: -1, y: -1, r: 2 },
      { x: -2, y: 0, r: 2 },
      { x: -1, y: 1, r: 2 },
      { x: 0, y: 2, r: 2 },
    ]);
  });

  it("can get a range of (1,2) - topology eight", () => {
    const rf = new RangeFinder({
      topology: "eight",
    });
    const range = rf.compute({
      start: { x: 0, y: 0 },
      maxRange: 2,
      minRange: 1,
    });
    expect(range).toHaveLength(24);
    expect(range).toEqual([
      // gen 1
      { r: 1, x: 1, y: 0 },
      { r: 1, x: 0, y: -1 },
      { r: 1, x: -1, y: 0 },
      { r: 1, x: 0, y: 1 },
      { r: 1, x: 1, y: -1 },
      { r: 1, x: -1, y: -1 },
      { r: 1, x: -1, y: 1 },
      { r: 1, x: 1, y: 1 },

      // gen 2
      { r: 2, x: 2, y: 0 },
      { r: 2, x: 2, y: -1 },
      { r: 2, x: 2, y: 1 },
      { r: 2, x: 0, y: -2 },
      { r: 2, x: 1, y: -2 },
      { r: 2, x: -1, y: -2 },
      { r: 2, x: -2, y: 0 },
      { r: 2, x: -2, y: -1 },
      { r: 2, x: -2, y: 1 },
      { r: 2, x: 0, y: 2 },
      { r: 2, x: -1, y: 2 },
      { r: 2, x: 1, y: 2 },
      { r: 2, x: 2, y: -2 },
      { r: 2, x: -2, y: -2 },
      { r: 2, x: -2, y: 2 },
      { r: 2, x: 2, y: 2 },
    ]);
  });

  it("can work with a distance function - topology four", () => {
    const wall = { x: 1, y: 0 };

    const fs = new RangeFinder({
      topology: "four",
      getDistanceCallback: (_, to) => (Vector.areEqual(to, wall) ? 5 : 1),
    });
    const range = fs.compute({
      start: { x: 0, y: 0 },
      maxRange: 4,
    });

    // Don't expect us to use the wall
    for (let r of range) {
      expect(Vector.areEqual(r, wall)).toBeFalsy();
    }
    // Expect us to have gone around the wall
    expect(range.some((v) => Vector.areEqual(v, { x: 2, y: 0 }))).toBeTruthy();
  });

  it("can work with a distance function - topology eight", () => {
    const wall = { x: 1, y: 0 };

    const fs = new RangeFinder({
      topology: "eight",
      getDistanceCallback: (_, to) => (Vector.areEqual(to, wall) ? 5 : 1),
    });
    const range = fs.compute({
      start: { x: 0, y: 0 },
      maxRange: 4,
    });

    // Don't expect us to use the wall
    for (let r of range) {
      expect(Vector.areEqual(r, wall)).toBeFalsy();
    }
    // Expect us to have gone around the wall
    expect(range.some((v) => Vector.areEqual(v, { x: 2, y: 0 }))).toBeTruthy();
  });

  it("will change if it found a shorter path", () => {
    const fs = new RangeFinder({
      topology: "four",
      getDistanceCallback: (from, to) => {
        if (Vector.areEqual(from, { x: 0, y: -1 })) {
          return 0.5;
        } else {
          return 1;
        }
      },
    });

    const range = fs.compute({
      start: { x: 0, y: 0 },
      minRange: 0,
      maxRange: 2,
    });
    expect(
      range.some((rv) => Vector.areEqual(rv, { x: 1, y: -1 }) && rv.r === 1.5)
    ).toBeTruthy();
  });
});
