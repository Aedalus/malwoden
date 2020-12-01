import { getRing, PreciseShadowcasting, diffRationalNums } from "./precise";

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
    const s = new PreciseShadowcasting((x, y) => true);
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
        y: 1,
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
        y: -1,
        visibility: 1,
        r: 1,
      },
    ]);
  });

  it("will calculate with blocked tiles", () => {
    const s = new PreciseShadowcasting((x, y) => (x == 1 && y == 0) === false);
    const spaces = s.calculateVectors(0, 0, 2);
    expect(spaces).toEqual([]);
  });
});

describe("getRing", () => {
  it("can compute size 0", () => {
    const ring0 = getRing(0, 0, 0);
    expect(ring0).toEqual([{ x: 0, y: 0 }]);
  });

  it("can compute size = 1", () => {
    const ring1 = getRing(0, 0, 1);
    expect(ring1).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ]);

    const ring1_b = getRing(1, 1, 1);
    expect(ring1_b).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ]);

    const ring1_c = getRing(-1, 1, 1);
    expect(ring1_c).toEqual([
      { x: 0, y: 1 },
      { x: -1, y: 2 },
      { x: -2, y: 1 },
      { x: -1, y: 0 },
    ]);
  });

  it("can compute size 2", () => {
    const ring2 = getRing(0, 0, 2);
    expect(ring2).toEqual([
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: -1, y: 1 },
      { x: -2, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: -2 },
      { x: 1, y: -1 },
    ]);

    const ring2_b = getRing(-1, 1, 2);
    expect(ring2_b).toEqual([
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: -1, y: 3 },
      { x: -2, y: 2 },
      { x: -3, y: 1 },
      { x: -2, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: 0 },
    ]);
  });

  it("can compute size 3", () => {
    const ring3 = getRing(0, 0, 3);
    expect(ring3).toEqual([
      { x: 3, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
      { x: -1, y: 2 },
      { x: -2, y: 1 },
      { x: -3, y: 0 },
      { x: -2, y: -1 },
      { x: -1, y: -2 },
      { x: 0, y: -3 },
      { x: 1, y: -2 },
      { x: 2, y: -1 },
    ]);

    const ring3_b = getRing(-1, 1, 3);
    expect(ring3_b).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
      { x: -1, y: 4 },
      { x: -2, y: 3 },
      { x: -3, y: 2 },
      { x: -4, y: 1 },
      { x: -3, y: 0 },
      { x: -2, y: -1 },
      { x: -1, y: -2 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ]);
  });
});
