import { Color } from "./color";

describe("Color", () => {
  it("Can create basic colors from rgb", () => {
    const c = new Color(10, 20, 30);
    expect(c.r).toEqual(10);
    expect(c.g).toEqual(20);
    expect(c.b).toEqual(30);
  });

  it("Can compare colors", () => {
    const tests: [Color, Color, boolean][] = [
      [new Color(5, 10, 20), new Color(5, 10, 20), true],
      [new Color(0, 0, 0), new Color(0, 0, 0), true],
      [new Color(255, 255, 0), new Color(255, 255, 0), true],
      [new Color(255, 0, 255), new Color(255, 255, 0), false],
      [new Color(1, 2, 3), new Color(4, 5, 6), false],
    ];

    for (let [c1, c2, bool] of tests) {
      expect(c1.isEqual(c2)).toEqual(bool);
      expect(c2.isEqual(c1)).toEqual(bool);

      expect(c1.isEqual(c1)).toEqual(true);
      expect(c2.isEqual(c2)).toEqual(true);
    }
  });

  it("Can get a css color", () => {
    expect(new Color(10, 20, 30).cssColor()).toEqual("rgb(10,20,30)");
    expect(new Color(100, 100, 255).cssColor()).toEqual("rgb(100,100,255)");
  });

  it("Can add another color", () => {
    const c = new Color(10, 20, 30);
    const n = c.add(new Color(10, 10, 10));

    expect(n.r).toEqual(20);
    expect(n.g).toEqual(30);
    expect(n.b).toEqual(40);

    const n2 = c.add(new Color(10, 10, 10), 0.5);
    expect(n2.r).toEqual(15);
    expect(n2.g).toEqual(25);
    expect(n2.b).toEqual(35);
  });

  it("Can blend another color", () => {
    const c = new Color(10, 20, 30);
    const n = c.blend(new Color(10, 10, 10));

    expect(n.r).toEqual(10);
    expect(n.g).toEqual(15);
    expect(n.b).toEqual(20);
  });

  it("Can blend a percent", () => {
    const c = new Color(10, 20, 30);
    const n = c.blendPercent(new Color(10, 10, 10), 50);

    expect(n.r).toEqual(10);
    expect(n.g).toEqual(15);
    expect(n.b).toEqual(20);
  });

  it("Can get average grayscale", () => {
    const c = new Color(10, 20, 30);
    const g = c.toAvgGrayscale();

    expect(g.r).toEqual(20);
    expect(g.g).toEqual(20);
    expect(g.b).toEqual(20);
  });

  it("Can get grayscale", () => {
    const c = new Color(10, 20, 30);
    const g = c.toGrayscale();

    expect(g.r).toEqual(Math.round(10 * 0.299));
    expect(g.g).toEqual(Math.round(20 * 0.587));
    expect(g.b).toEqual(Math.round(30 * 0.114));
  });
});
