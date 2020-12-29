import { Rect } from "./rect";

describe("rect", () => {
  it("Can create a basic rectangle", () => {
    const rect = new Rect({ x: 0, y: 0 }, { x: 5, y: 10 });

    expect(rect.v1).toEqual({ x: 0, y: 0 });
    expect(rect.v2).toEqual({ x: 5, y: 10 });
  });

  it("Will remap v1/v2 to be the min/max corners", () => {
    const rect = new Rect({ x: 5, y: 10 }, { x: -5, y: -10 });
    expect(rect.v1).toEqual({ x: -5, y: -10 });
    expect(rect.v2).toEqual({ x: 5, y: 10 });

    const rect2 = new Rect({ x: 5, y: -10 }, { x: -5, y: 10 });
    expect(rect2.v1).toEqual({ x: -5, y: -10 });
    expect(rect2.v2).toEqual({ x: 5, y: 10 });
  });

  it("Can get width and height", () => {
    const rect = new Rect({ x: 0, y: 0 }, { x: 5, y: 10 });

    expect(rect.width()).toEqual(6);
    expect(rect.height()).toEqual(11);
  });

  it("Can check if a rectangle intersects", () => {
    const tests: [Rect, Rect, Boolean][] = [
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        true,
      ],
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: -5, y: -5 }, { x: 0, y: 0 }),
        true,
      ],
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: -5, y: -5 }, { x: -1, y: -1 }),
        false,
      ],
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: 5, y: -5 }, { x: 5, y: -1 }),
        false,
      ],
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: 5, y: 10 }, { x: 6, y: 11 }),
        true,
      ],
      [
        new Rect({ x: 0, y: 0 }, { x: 5, y: 10 }),
        new Rect({ x: 6, y: 11 }, { x: 6, y: 11 }),
        false,
      ],
    ];

    for (let [r1, r2, bool] of tests) {
      expect(r1.intersects(r2)).toEqual(bool);
      expect(r2.intersects(r1)).toEqual(bool);
    }
  });
});
