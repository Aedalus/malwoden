import { Glyph } from "./glyph";
import { Color } from "./color";

describe("Glyph", () => {
  it("Can create a new Glyph", () => {
    const g = new Glyph("f", Color.Green, Color.Black);

    expect(g.char).toEqual("f".charCodeAt(0));
    expect(g.fore.isEqual(Color.Green)).toBeTruthy();
    expect(g.back.isEqual(Color.Black)).toBeTruthy();

    const defaults = new Glyph("f");
    expect(defaults.fore.isEqual(Color.White)).toBeTruthy();
    expect(defaults.back.isEqual(Color.Black)).toBeTruthy();
  });

  it("Can create a new Glyph from charcode", () => {
    const g = Glyph.fromCharCode(102, Color.Green, Color.Black);
    expect(g.char).toEqual(102);
    expect(g.fore.isEqual(Color.Green)).toBeTruthy();
    expect(g.back.isEqual(Color.Black)).toBeTruthy();

    const defaults = Glyph.fromCharCode(102);
    expect(defaults.fore.isEqual(Color.White)).toBeTruthy();
    expect(defaults.back.isEqual(Color.Black)).toBeTruthy();
  });

  it("Can confirm equal", () => {
    const g = new Glyph("g", Color.Blue, Color.Green);
    const f = new Glyph("g", Color.Blue, Color.Green);

    const x = new Glyph("g", Color.Blue, Color.Blue);
    const y = new Glyph("g", Color.Green, Color.Green);
    const z = new Glyph("z", Color.Blue, Color.Green);

    const tests: [Glyph, Glyph, boolean][] = [
      [g, f, true],
      [g, x, false],
      [g, y, false],
      [g, z, false],
    ];

    for (let [g1, g2, bool] of tests) {
      expect(g1.isEqual(g2)).toEqual(bool);
      expect(g2.isEqual(g1)).toEqual(bool);
    }

    // Test for non-glyph
    expect(g.isEqual({})).toBeFalsy();
  });
});
