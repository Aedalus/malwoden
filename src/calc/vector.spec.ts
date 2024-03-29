import { Vector2 } from "../struct";
import { Vector } from "./vector";

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
      expect(Vector.areEqual(v1, v2)).toBeTruthy();
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
      expect(Vector.areEqual(v1, v2)).toBeFalsy();
    }
  });
});

describe("getDistance", () => {
  it("Can get the distance between two vectors", () => {
    const tests: [Vector2, Vector2, number][] = [
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, 0],
      [{ x: 1, y: 0 }, { x: 0, y: 0 }, 1],
      [{ x: 1, y: 1 }, { x: 0, y: 0 }, Math.sqrt(2)],
      [{ x: 100, y: 100 }, { x: -100, y: -100 }, Math.sqrt(80000)],
    ];

    for (let [v1, v2, d] of tests) {
      expect(Vector.getDistance(v1, v2)).toEqual(d);
    }
  });

  it("Can get the distance between two vectors - 4", () => {
    const tests: [Vector2, Vector2, number][] = [
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, 0],
      [{ x: 1, y: 0 }, { x: 0, y: 0 }, 1],
      [{ x: 1, y: 1 }, { x: 0, y: 0 }, 2],
      [{ x: 100, y: 100 }, { x: -100, y: -100 }, 400],
    ];

    for (let [v1, v2, d] of tests) {
      expect(Vector.getDistance(v1, v2, "four")).toEqual(d);
    }
  });

  it("Can get the distance between two vectors - 8", () => {
    const tests: [Vector2, Vector2, number][] = [
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, 0],
      [{ x: 1, y: 0 }, { x: 0, y: 0 }, 1],
      [{ x: 1, y: 1 }, { x: 0, y: 0 }, 1],
      [{ x: 100, y: 100 }, { x: -100, y: -100 }, 200],
    ];

    for (let [v1, v2, d] of tests) {
      expect(Vector.getDistance(v1, v2, "eight")).toEqual(d);
    }
  });
});

describe("getCenter", () => {
  it("Can get a center point", () => {
    expect(
      Vector.getCenter([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ])
    ).toEqual({ x: 5, y: 5 });

    expect(
      Vector.getCenter([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 100, y: 100 },
      ])
    ).toEqual({
      x: 110 / 3,
      y: 110 / 3,
    });
  });

  it("Will throw an error if the area is empty", () => {
    expect(() => Vector.getCenter([])).toThrow(
      "Error: Trying to find center of empty area"
    );
  });
});

describe("getClosest", () => {
  it("Can get the closest vector - 4", () => {
    const result = Vector.getClosest(
      [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 100, y: 100 },
        { x: 1000, y: 1000 },
      ],
      { x: 20, y: 20 }
    );

    expect(result).toEqual({ x: 10, y: 10 });
  });

  it("Can get the closest vector - 8", () => {
    const result = Vector.getClosest(
      [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 100, y: 100 },
        { x: 1000, y: 1000 },
      ],
      { x: 20, y: 20 },
      "eight"
    );

    expect(result).toEqual({ x: 10, y: 10 });
  });

  it("Will immediately return if an exact match is found", () => {
    expect(
      Vector.getClosest(
        [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
          { x: 10, y: 10 },
        ],
        { x: 5, y: 5 }
      )
    ).toEqual({ x: 5, y: 5 });
  });

  it("Will throw an error if the area is empty", () => {
    expect(() => Vector.getClosest([], { x: 0, y: 0 })).toThrow(
      "Error: Trying to find closest position of an empty area"
    );
  });
});

describe("add", () => {
  it("Can add vectors", () => {
    expect(Vector.add({ x: 0, y: 0 }, { x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(Vector.add({ x: -1, y: -2 }, { x: 1, y: 2 })).toEqual({
      x: 0,
      y: 0,
    });
    expect(Vector.add({ x: -1, y: -2 }, { x: -1, y: -2 })).toEqual({
      x: -2,
      y: -4,
    });
  });
});

describe("subtract", () => {
  it("Can subtract vectors", () => {
    expect(Vector.subtract({ x: 0, y: 0 }, { x: 1, y: 2 })).toEqual({
      x: -1,
      y: -2,
    });
    expect(Vector.subtract({ x: -1, y: -2 }, { x: 1, y: 2 })).toEqual({
      x: -2,
      y: -4,
    });
    expect(Vector.subtract({ x: -1, y: -2 }, { x: -1, y: -2 })).toEqual({
      x: 0,
      y: 0,
    });
  });
});
