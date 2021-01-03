import { Vector2 } from "../util/vector";
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
    this.foreColor = config.foreColor || Color.White;
    this.backColor = config.backColor || Color.Black;
  }

  size(): Vector2 {
    return {
      x: this.width,
      y: this.height,
    };
  }

  clear() {
    this.fill({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });
  }

  fill({
    x,
    y,
    width,
    height,
    color = this.backColor,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: Color;
  }) {
    const glyph = new Glyph(" ", this.foreColor, color);
    for (let py = y; py < y + height; py++) {
      for (let px = x; px < x + width; px++) {
        this.drawGlyph({ x: px, y: py }, glyph);
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

  rect(x: number, y: number, width: number, height: number) {
    // TODO: Bounds check.
    return new PortTerminal(x, y, { x: width, y: height }, this);
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
  readonly _x: number;
  readonly _y: number;
  readonly portSize: Vector2;

  readonly root: BaseTerminal;

  constructor(x: number, y: number, size: Vector2, root: BaseTerminal) {
    super({ width: size.x, height: size.y });
    this._x = x;
    this._y = y;
    this.portSize = size;
    this.root = root;
  }

  drawGlyph(pos: Vector2, glyph: Glyph) {
    if (pos.x < 0 || pos.x >= this.width) return;
    if (pos.y < 0 || pos.y >= this.height) return;
    this.root.drawGlyph({ x: this._x + pos.x, y: this._y + pos.y }, glyph);
  }

  rect(x: number, y: number, width: number, height: number) {
    return new PortTerminal(
      this._x + x,
      this._y + y,
      { x: width, y: height },
      this.root
    );
  }
}
