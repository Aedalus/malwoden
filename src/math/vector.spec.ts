import { Vector2 } from "../util";
import { areEqual, getDistance, getCenter, getClosest } from "./vector";

describe("areEqual", () => {
  it("returns true if two vectors are equal", () => {
    const tests: [Vector2, Vector2][] = [
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      [
        { x: 1, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: -5, y: -5 },
        { x: -5, y: -5 },
      ],
    ];

    for (let [v1, v2] of tests) {
      expect(areEqual(v1, v2)).toBeTruthy();
    }
  });
  it("returns false if two vectors are unequal", () => {
    const tests: [Vector2, Vector2][] = [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ],
      [
        { x: -5, y: 0 },
        { x: -5, y: 1 },
      ],
    ];

    for (let [v1, v2] of tests) {
      expect(areEqual(v1, v2)).toBeFalsy();
    }
  });
});

describe("getDistance", () => {
  it("Can get the distance between two vectors - 4", () => {
    const tests: [Vector2, Vector2, number][] = [
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, 0],
      [{ x: 1, y: 0 }, { x: 0, y: 0 }, 1],
      [{ x: 1, y: 1 }, { x: 0, y: 0 }, 2],
      [{ x: 100, y: 100 }, { x: -100, y: -100 }, 400],
    ];

    for (let [v1, v2, d] of tests) {
      expect(getDistance(v1, v2, "four")).toEqual(d);
    }
  });
});
