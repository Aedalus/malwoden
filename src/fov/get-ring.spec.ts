import { getRing4, getRing8 } from "./get-ring";

describe("getRing - 4", () => {
  it("can compute size 0", () => {
    const ring0 = getRing4(0, 0, 0);
    expect(ring0).toEqual([{ x: 0, y: 0 }]);
  });

  it("can compute size = 1", () => {
    const ring1 = getRing4(0, 0, 1);
    expect(ring1).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
    ]);

    const ring1_b = getRing4(1, 1, 1);
    expect(ring1_b).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ]);

    const ring1_c = getRing4(-1, 1, 1);
    expect(ring1_c).toEqual([
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: -2, y: 1 },
      { x: -1, y: 2 },
    ]);
  });

  it("can compute size 2", () => {
    const ring2 = getRing4(0, 0, 2);
    expect(ring2).toEqual([
      { x: 2, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -2 },
      { x: -1, y: -1 },
      { x: -2, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
    ]);

    const ring2_b = getRing4(-1, 1, 2);
    expect(ring2_b).toEqual([
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: -1, y: -1 },
      { x: -2, y: 0 },
      { x: -3, y: 1 },
      { x: -2, y: 2 },
      { x: -1, y: 3 },
      { x: 0, y: 2 },
    ]);
  });

  it("can compute size 3", () => {
    const ring3 = getRing4(0, 0, 3);
    expect(ring3).toEqual([
      { x: 3, y: 0 },
      { x: 2, y: -1 },
      { x: 1, y: -2 },
      { x: 0, y: -3 },
      { x: -1, y: -2 },
      { x: -2, y: -1 },
      { x: -3, y: 0 },
      { x: -2, y: 1 },
      { x: -1, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ]);

    const ring3_b = getRing4(-1, 1, 3);
    expect(ring3_b).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: -2 },
      { x: -2, y: -1 },
      { x: -3, y: 0 },
      { x: -4, y: 1 },
      { x: -3, y: 2 },
      { x: -2, y: 3 },
      { x: -1, y: 4 },
      { x: 0, y: 3 },
      { x: 1, y: 2 },
    ]);
  });
});

describe("getRing - 8", () => {
  it("can compute size 0", () => {
    expect(getRing8(0, 0, 0)).toEqual([{ x: 0, y: 0 }]);
    expect(getRing8(1, 2, 0)).toEqual([{ x: 1, y: 2 }]);
  });
  it("can compute size 1", () => {
    expect(getRing8(0, 0, 1)).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
    expect(getRing8(1, 2, 1)).toEqual([
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ]);
  });
});
