import { Glyph } from "./glyph";
import { Vector2 } from "../util/vector";
import { Table } from "../util/table";

type RenderGlyph = (pos: Vector2, glyph: Glyph) => any;

/** Represents glyph data, agnostic to how it is rendered. */
export class Display {
  glyphs: Table<Glyph>;
  changedGlyphs: Table<Glyph>;

  readonly width: number;
  readonly height: number;

  /**
   * Creates a new Display
   * @param width - The number of glyphs wide the display is
   * @param height - The number of glyphs tall the display is
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.glyphs = new Table(width, height);
    this.changedGlyphs = new Table(width, height);
  }

  /**
   * Returns a Vector representing the width/height of the display.
   */
  size(): Vector2 {
    return { x: this.width, y: this.height };
  }

  /**
   * Sets a single glyph in the display.
   *
   * @param pos Vector2 - The position of the Glyph
   * @param glyph Glyph - The Glyph
   */
  setGlyph(pos: Vector2, glyph: Glyph) {
    if (this.glyphs.isInBounds(pos) === false) return;
    if (glyph.isEqual(this.glyphs.get(pos))) {
      this.changedGlyphs.set(pos, undefined);
    } else {
      this.changedGlyphs.set(pos, glyph);
    }
  }

  /**
   * Calls the callback with each x/y/glyph pair.
   * The terminal needs to decide how to render the display.
   * The callback is called bottom to top, right to left.
   */
  render(callback: RenderGlyph) {
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = this.width - 1; x >= 0; x--) {
        const glyph = this.changedGlyphs.get({ x, y });
        if (!glyph) continue;
        callback({ x, y }, glyph);

        this.glyphs.set({ x, y }, glyph);
        this.changedGlyphs.set({ x, y }, undefined);
      }
    }
  }
}
