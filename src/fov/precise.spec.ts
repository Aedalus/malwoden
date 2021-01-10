import { Vector } from "../math";
import { PreciseShadowcasting, diffRationalNums } from "./precise";

describe("diffRationamNum", () => {
  it("can get the difference between rational numbers", () => {
    const tests: [[number, number], [number, number], number][] = [
      [[2, 1], [2, 1], 0],
      [[2, 1], [3, 1], -1],
      [[2, 4], [1, 2], 0],
    ];

    for (let [a, b, d] of tests) {
      expect(diffRationalNums(a, b)).toEqual(d);
    }
  });
});

describe("Shadowcasting", () => {
  it("will calculate for empty tiles", () => {
    const s = new PreciseShadowcasting((x, y) => true, "four");
    const tiles = s.calculateVectors(1, 1, 0);
    expect(tiles).toEqual([
      {
        x: 1,
        y: 1,
        r: 0,
        visibility: 1,
      },
    ]);

    const tiles2 = s.calculateVectors(0, 0, 1);
    expect(tiles2).toHaveLength(5);
    expect(tiles2).toEqual([
      {
        x: 0,
        y: 0,
        visibility: 1,
        r: 0,
      },
      {
        x: 1,
        y: 0,
        visibility: 1,
        r: 1,
      },
      {
        x: 0,
        y: -1,
        visibility: 1,
        r: 1,
      },
      {
        x: -1,
        y: 0,
        visibility: 1,
        r: 1,
      },
      {
        x: 0,
        y: 1,
        visibility: 1,
        r: 1,
      },
    ]);
  });

  // ToDo - Currently doesn't return if not visible at all?
  // Keep this or not?
  it("will calculate with blocked tiles", () => {
    const s = new PreciseShadowcasting((x, y) => (x == 1 && y == 0) === false);
    const spaces = s.calculateVectors(0, 0, 2);
    expect(spaces).toEqual([
      // Ring 0
      {
        r: 0,
        visibility: 1,
        x: 0,
        y: 0,
      },
      // Ring 1
      {
        r: 1,
        visibility: 1,
        x: 1,
        y: 0,
      },
      {
        r: 1,
        visibility: 1,
        x: 1,
        y: -1,
      },
      {
        r: 1,
        visibility: 1,
        x: 0,
        y: -1,
      },
      {
        r: 1,
        visibility: 1,
        x: -1,
        y: -1,
      },
      {
        r: 1,
        visibility: 1,
        x: -1,
        y: 0,
      },
      {
        r: 1,
        visibility: 1,
        x: -1,
        y: 1,
      },
      {
        r: 1,
        visibility: 1,
        x: 0,
        y: 1,
      },
      {
        r: 1,
        visibility: 1,
        x: 1,
        y: 1,
      },

      // Ring 2
      // { Doesn't return since not visible
      //   r: 2,
      //   visibility: 0,
      //   x: 2,
      //   y: 0,
      // },
      {
        r: 2,
        visibility: 0.5,
        x: 2,
        y: -1,
      },
      {
        r: 2,
        visibility: 1,
        x: 2,
        y: -2,
      },
      {
        r: 2,
        visibility: 1,
        x: 1,
        y: -2,
      },
      {
        r: 2,
        visibility: 1,
        x: 0,
        y: -2,
      },
      {
        r: 2,
        visibility: 1,
        x: -1,
        y: -2,
      },
      {
        r: 2,
        visibility: 1,
        x: -2,
        y: -2,
      },
      {
        r: 2,
        visibility: 1,
        x: -2,
        y: -1,
      },
      {
        r: 2,
        visibility: 1,
        x: -2,
        y: 0,
      },
      {
        r: 2,
        visibility: 1,
        x: -2,
        y: 1,
      },
      {
        r: 2,
        visibility: 1,
        x: -2,
        y: 2,
      },
      {
        r: 2,
        visibility: 1,
        x: -1,
        y: 2,
      },
      {
        r: 2,
        visibility: 1,
        x: 0,
        y: 2,
      },
      {
        r: 2,
        visibility: 1,
        x: 1,
        y: 2,
      },
      {
        r: 2,
        visibility: 1,
        x: 2,
        y: 2,
      },
      {
        r: 2,
        visibility: 0.5,
        x: 2,
        y: 1,
      },
    ]);
  });

  it("Will show immediately adjacent even if no light passes", () => {
    const s = new PreciseShadowcasting(() => false, "four");

    expect(s.calculateVectors(0, 0, 2)).toEqual([
      { r: 0, visibility: 1, x: 0, y: 0 },
      { r: 1, visibility: 1, x: 1, y: 0 },
      { r: 1, visibility: 1, x: 0, y: -1 },
      { r: 1, visibility: 1, x: -1, y: 0 },
      { r: 1, visibility: 1, x: 0, y: 1 },
    ]);
  });

  it("Won't merge ranges if the checked block is non-blocking", () => {
    const s = new PreciseShadowcasting(() => false, "four");

    expect(
      s["checkVisibility"]([5, 8], [7, 8], false, [
        [0, 1],
        [5, 8],
        [7, 8],
        [8, 8],
      ])
    ).toEqual(1);
  });

  it("Can calculate if a shadow overlaps", () => {
    const s = new PreciseShadowcasting(
      (x, y) =>
        !Vector.areEqual({ x, y }, { x: 1, y: 0 }) &&
        !Vector.areEqual({ x, y }, { x: 1, y: -1 }) &&
        !Vector.areEqual({ x, y }, { x: 1, y: 1 }) &&
        !Vector.areEqual({ x, y }, { x: 2, y: 0 })
    );
    const spaces = s.calculateVectors(0, 0, 2);

    const blocked_a = spaces.find((s) => Vector.areEqual(s, { x: 1, y: 0 }));
    const blocked_b = spaces.find((s) => Vector.areEqual(s, { x: 2, y: 0 }));
    expect(blocked_a).toEqual({
      r: 1,
      visibility: 1,
      x: 1,
      y: 0,
    });
    expect(blocked_b).toBeUndefined();
  });

  it("Can calculate if a shadow is equivalent", () => {
    const s = new PreciseShadowcasting(() => true);

    expect(s["checkShadowVisibility"](5, 5, true, false)).toEqual(false);
    expect(s["checkShadowVisibility"](6, 7, true, true)).toEqual(false);
    expect(s["checkShadowVisibility"](7, 6, true, false)).toEqual(false);
  });
});
