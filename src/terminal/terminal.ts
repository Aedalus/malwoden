import { Vector2 } from "../struct/vector";
import { Color } from "./color";
import { Glyph } from "./glyph";

export interface TerminalConfig {
  width: number;
  height: number;
  foreColor?: Color;
  backColor?: Color;
}

export abstract class BaseTerminal {
  readonly width: number;
  readonly height: number;

  foreColor: Color;
  backColor: Color;

  constructor(config: TerminalConfig) {
    this.width = config.width;
    this.height = config.height;
    this.foreColor = config.foreColor ?? Color.White;
    this.backColor = config.backColor ?? Color.Black;
  }

  size(): Vector2 {
    return {
      x: this.width,
      y: this.height,
    };
  }

  clear() {
    this.fill(
      { x: 0, y: 0 },
      { x: this.width - 1, y: this.height - 1 },
      new Glyph(" ")
    );
  }

  fill(v1: Vector2, v2: Vector2, glyph: Glyph) {
    for (let x = v1.x; x <= v2.x; x++) {
      for (let y = v1.y; y <= v2.y; y++) {
        this.drawGlyph({ x, y }, glyph);
      }
    }
  }

  writeAt(
    pos: Vector2,
    text: string,
    fore = this.foreColor,
    back = this.backColor
  ) {
    for (let i = 0; i < text.length; i++) {
      if (pos.x + i >= this.width) break;
      this.drawGlyph(
        {
          x: pos.x + i,
          y: pos.y,
        },
        Glyph.fromCharCode(text.charCodeAt(i), fore, back)
      );
    }
  }

  drawCharCode(
    pos: Vector2,
    charCode: number,
    foreColor = this.foreColor,
    backColor = this.backColor
  ) {
    this.drawGlyph(pos, Glyph.fromCharCode(charCode, foreColor, backColor));
  }

  abstract drawGlyph(pos: Vector2, glyph: Glyph): void;
  abstract windowToTilePoint(pixel: Vector2): Vector2;
  abstract delete(): void;
}
