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
    this.foreColor = config.foreColor || Color.white;
    this.backColor = config.backColor || Color.black;
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
        this.drawGlyph(px, py, glyph);
      }
    }
  }

  writeAt({
    x,
    y,
    text,
    fore = this.foreColor,
    back = this.backColor,
  }: {
    x: number;
    y: number;
    text: string;
    fore?: Color;
    back?: Color;
  }) {
    for (let i = 0; i < text.length; i++) {
      if (x + i >= this.width) break;
      this.drawGlyph(x + i, y, Glyph.fromCharCode(text.charCodeAt(i), fore, back));
    }
  }

  rect(x: number, y: number, width: number, height: number) {
    // TODO: Bounds check.
    return new PortTerminal(x, y, { x: width, y: height }, this);
  }

  drawCharCode({
    x,
    y,
    charCode,
    fore = this.foreColor,
    back = this.backColor,
  }: {
    x: number;
    y: number;
    charCode: number;
    fore?: Color;
    back?: Color;
  }) {
    this.drawGlyph(x, y, Glyph.fromCharCode(charCode, fore, back));
  }

  abstract drawGlyph(x: number, y: number, glyph: Glyph): void;
}

export abstract class RenderableTerminal extends BaseTerminal {
  abstract render(): void;

  abstract pixelToChar(pixel: Vector2): Vector2;
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

  drawGlyph(x: number, y: number, glyph: Glyph) {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;
    this.root.drawGlyph(this._x + x, this._y + y, glyph);
  }

  rect(x: number, y: number, width: number, height: number) {
    return new PortTerminal(this._x + x, this._y + y, { x: width, y: height }, this.root);
  }
}
