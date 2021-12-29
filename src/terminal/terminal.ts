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

  port(pos: Vector2, width: number, height: number) {
    return new PortTerminal(pos, { x: width, y: height }, this);
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
}

export abstract class RenderableTerminal extends BaseTerminal {
  abstract render(): void;

  abstract pixelToChar(pixel: Vector2): Vector2;

  abstract delete(): void;
}

export class PortTerminal extends BaseTerminal {
  private readonly _x: number;
  private readonly _y: number;
  readonly portSize: Vector2;

  readonly root: BaseTerminal;

  constructor(pos: Vector2, size: Vector2, root: BaseTerminal) {
    super({ width: size.x, height: size.y });
    this._x = pos.x;
    this._y = pos.y;
    this.portSize = size;
    this.root = root;
  }

  drawGlyph(pos: Vector2, glyph: Glyph) {
    if (pos.x < 0 || pos.x >= this.width) return;
    if (pos.y < 0 || pos.y >= this.height) return;
    this.root.drawGlyph({ x: this._x + pos.x, y: this._y + pos.y }, glyph);
  }

  port(pos: Vector2, width: number, height: number) {
    return new PortTerminal(
      {
        x: this._x + pos.x,
        y: this._y + pos.y,
      },
      { x: width, y: height },
      this.root
    );
  }
}
