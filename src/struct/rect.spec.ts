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

  it("can get a center", () => {
    const rectEven = new Rect({ x: 0, y: 0 }, { x: 5, y: 5 });
    const rectOdd = new Rect({ x: 0, y: 0 }, { x: 4, y: 4 });

    expect(rectOdd.center()).toEqual({ x: 2, y: 2 });
    expect(rectEven.center()).toEqual({ x: 2, y: 2 });
  });

  it("can create a rect from width/height", () => {
    const r = Rect.FromWidthHeight({ x: 3, y: 5 }, 2, 5);
    expect(r.v1).toEqual({ x: 3, y: 5 });
    expect(r.v2).toEqual({ x: 4, y: 9 });
  });

  it("will throw an error on invalid width/height", () => {
    expect(() => Rect.FromWidthHeight({ x: 0, y: 0 }, 0, 0)).toThrow();
    expect(() => Rect.FromWidthHeight({ x: 0, y: 0 }, 0, 1)).toThrow();
    expect(() => Rect.FromWidthHeight({ x: 0, y: 0 }, 1, 0)).toThrow();
  });
});
