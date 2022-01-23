import { BaseTerminal } from ".";
import { Table, Vector2 } from "../struct";
import { Glyph } from "./glyph";
import { TerminalConfig } from "./terminal";

export class MemoryTerminal extends BaseTerminal {
  windowToTilePoint(pixel: Vector2): Vector2 {
    return pixel;
  }
  delete(): void {}

  glyphs: Table<Glyph>;

  constructor(config: TerminalConfig) {
    super(config);
    this.glyphs = new Table(config.width, config.height);
  }

  drawGlyph(pos: Vector2, glyph: Glyph): void {
    if (this.glyphs.isInBounds(pos) === false) return;
    this.glyphs.set(pos, glyph);
  }
}
