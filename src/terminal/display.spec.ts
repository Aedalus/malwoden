import { Vector2 } from "../util/vector";
import { Display } from "./display";
import { Glyph } from "./glyph";

describe("Display", () => {
  it("Can get the Size", () => {
    const d = new Display(10, 20);

    expect(d.width).toEqual(10);
    expect(d.height).toEqual(20);

    expect(d.size()).toEqual({ x: 10, y: 20 });
  });

  it("Won't update the table until rendering", () => {
    const d = new Display(10, 10);

    d.setGlyph({ x: 5, y: 5 }, new Glyph("x"));
    d.render(() => {});
    d.setGlyph({ x: 5, y: 5 }, new Glyph("x"));

    d.render((pos, glyph) => {
      if (pos.x === 5 && pos.y === 5) {
        expect(glyph.isEqual(new Glyph("x"))).toBeTruthy();
      }
    });
  });

  it("Won't store the glyph if out of bounds", () => {
    const d = new Display(10, 10);

    d.setGlyph({ x: -1, y: -1 }, new Glyph("x"));

    d.render((pos, g) => {
      throw new Error("Render shouldn't call anything. Unexpected Glyph");
    });
  });

  it("Can render", () => {
    const d = new Display(3, 3);
    d.setGlyph({ x: 0, y: 0 }, new Glyph("1"));
    d.setGlyph({ x: 1, y: 0 }, new Glyph("2"));
    d.setGlyph({ x: 2, y: 0 }, new Glyph("3"));
    d.setGlyph({ x: 0, y: 1 }, new Glyph("4"));
    d.setGlyph({ x: 1, y: 1 }, new Glyph("5"));
    d.setGlyph({ x: 2, y: 1 }, new Glyph("6"));
    d.setGlyph({ x: 0, y: 2 }, new Glyph("7"));
    d.setGlyph({ x: 1, y: 2 }, new Glyph("8"));
    d.setGlyph({ x: 2, y: 2 }, new Glyph("9"));

    const vectors: Vector2[] = [];
    const glyphs: Glyph[] = [];

    d.render((pos, glyph) => {
      vectors.push(pos);
      glyphs.push(glyph);
    });

    expect(vectors).toHaveLength(9);
    expect(vectors).toEqual([
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]);

    expect(glyphs).toHaveLength(9);
    for (let i = 0; i < 9; i++) {
      expect(glyphs[i].isEqual(new Glyph((i + 1).toString())));
    }
  });
});
