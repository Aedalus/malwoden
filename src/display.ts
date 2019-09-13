import { Glyph } from "./glyph";
import { Vector2 } from "./vector";
import { Table } from "./table";

type RenderGlyph = (x: number, y: number, glyph: Glyph) => any;

export class Display {
  glyphs: Table<Glyph>;
  changedGlyphs: Table<Glyph>;

  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.glyphs = new Table(width, height);
    this.changedGlyphs = new Table(width, height);
  }

  get size(): Vector2 {
    return { x: this.width, y: this.height };
  }

  setGlyph(x: number, y: number, glyph: Glyph) {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;
    if (glyph.isEqual(this.glyphs.get(x, y))) {
      this.changedGlyphs.set(x, y, undefined);
    } else {
      // console.log(x, y, glyph);
      this.changedGlyphs.set(x, y, glyph);
    }
  }

  render(callback: RenderGlyph) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const glyph = this.changedGlyphs.get(x, y);
        console.log(glyph);
        if (!glyph) continue;
        callback(x, y, glyph);

        this.glyphs.set(x, y, glyph);
        this.changedGlyphs.set(x, y, undefined);
      }
    }
  }
}
