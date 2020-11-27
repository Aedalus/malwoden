import { RenderableTerminal } from "./terminal";
import { Display } from "./display";
import { Glyph } from "./glyph";
import { Vector2 } from "../util/vector";

export class Font {
  readonly family: string;
  readonly size: number;
  readonly charWidth: number;
  readonly lineHeight: number;
  readonly x: number;
  readonly y: number;

  constructor(
    family: string,
    size: number,
    charWidth: number,
    height: number,
    x: number,
    y: number
  ) {
    this.family = family;
    this.size = size;
    this.charWidth = charWidth;
    this.lineHeight = height;
    this.x = x;
    this.y = y;
  }
}

export class Canvas extends RenderableTerminal {
  readonly display: Display;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly font: Font;
  readonly scale: number = window.devicePixelRatio;

  static New(width: number, height: number, font: Font, canvas?: HTMLCanvasElement): Canvas {
    const display = new Display(width, height);
    if (!canvas) {
      canvas = window.document.createElement("canvas");
      window.document.body.appendChild(canvas);
    }

    return new Canvas(display, font, canvas);
  }

  constructor(display: Display, font: Font, canvas: HTMLCanvasElement) {
    super({
      height: display.height,
      width: display.width,
    });
    this.display = display;
    this.font = font;
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const canvasWidth = this.font.charWidth * this.display.width;
    const canvasHeight = this.font.lineHeight * this.display.height;
    canvas.width = canvasWidth * this.scale;
    canvas.height = canvasHeight * this.scale;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
  }

  drawGlyph(x: number, y: number, glyph: Glyph) {
    this.display.setGlyph(x, y, glyph);
  }

  render() {
    this.context.font = `${this.font.size * this.scale}px ${this.font.family}, monospace`;

    this.display.render((x, y, glyph) => {
      // console.log(x, y, glyph);
      // Fill the background
      this.context.fillStyle = glyph.back.cssColor();
      this.context.fillRect(
        x * this.font.charWidth * this.scale,
        y * this.font.lineHeight * this.scale,
        this.font.charWidth * this.scale,
        this.font.lineHeight * this.scale
      );

      // Dont bother drawing empty characters
      if (glyph.char === 0 || " ".charCodeAt(0) === glyph.char) {
        return;
      }

      // Fill the char
      this.context.fillStyle = glyph.fore.cssColor();
      this.context.fillText(
        String.fromCharCode(glyph.char),
        (x * this.font.charWidth + this.font.x) * this.scale,
        (y * this.font.lineHeight + this.font.y) * this.scale
      );
    });
  }

  pixelToChar(pixel: Vector2): Vector2 {
    return {
      x: Math.floor(pixel.x / this.font.charWidth),
      y: Math.floor(pixel.y / this.font.lineHeight),
    };
  }
}
