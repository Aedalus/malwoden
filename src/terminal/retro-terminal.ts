import { RenderableTerminal } from "./terminal";

import { Display } from "./display";
import { Color } from "./color";
import { Glyph } from "./glyph";
import { unicodeMap } from "./unicodemap";
import { CharCode } from "./char-code";
import { Vector2 } from "../util/vector";

export class Retro extends RenderableTerminal {
  private readonly _display: Display;

  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _font: HTMLImageElement;

  // A cache of the tinted font images. Each key is a color, and the image is the font in that color.
  private readonly _fontColorCache = new Map<string, HTMLCanvasElement>();

  // Drawing scale, used for retina displays
  private readonly _scale: number;

  private _imageLoaded = false;

  private readonly _charWidth: number;
  private readonly _charHeight: number;

  static dos(width: number, height: number, canvas: HTMLCanvasElement) {
    // ToDo - Implement me
  }

  static shortDos(width: number, height: number, canvas: HTMLCanvasElement) {
    // ToDo - Implement me
  }

  static fromURL(
    width: number,
    height: number,
    imageURL: string,
    charWidth: number,
    charHeight: number,
    canvas?: HTMLCanvasElement
  ): Retro {
    let scale = devicePixelRatio;

    // Create a canvas if not define
    if (canvas === undefined) {
      canvas = window.document.createElement("canvas");
      const canvasWidth = charWidth * width;
      const canvasHeight = charHeight * height;
      canvas.width = canvasWidth * scale;
      canvas.height = canvasHeight * scale;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      document.body.append(canvas);
    } else {
      scale = 1;
    }

    const display = new Display(width, height);

    const img = new Image();
    img.src = imageURL;
    return new Retro(display, charWidth, charHeight, canvas, img, scale);
  }

  constructor(
    display: Display,
    charWidth: number,
    charHeight: number,
    canvas: HTMLCanvasElement,
    font: HTMLImageElement,
    scale: number
  ) {
    super({ width: display.width, height: display.height });

    this._display = display;
    this._charWidth = charWidth;
    this._charHeight = charHeight;
    this._canvas = canvas;
    this._context = canvas.getContext("2d")!;
    this._font = font;
    this._scale = scale;

    this._font.onload = () => {
      this._imageLoaded = true;
      this.render();
    };
  }

  drawGlyph(x: number, y: number, glyph: Glyph): void {
    this._display.setGlyph(x, y, glyph);
  }

  render() {
    if (!this._imageLoaded) return;

    this._display.render((x, y, glyph) => {
      let char = glyph.char;

      // Remap it if it's a Unicode character
      if (unicodeMap[char] !== undefined) {
        char = unicodeMap[char];
      }

      const sx = (char % 32) * this._charWidth;
      const sy = Math.floor(char / 32) * this._charHeight;

      // Fill the background
      this._context.fillStyle = glyph.back.cssColor();
      this._context.fillRect(
        x * this._charWidth * this._scale,
        y * this._charHeight * this._scale,
        this._charWidth * this._scale,
        this._charHeight * this._scale
      );

      // Dont bother with empty characters
      if (char == 0 || char == CharCode.space) return;

      const color = this.getColorFont(glyph.fore);
      this._context.imageSmoothingEnabled = false;
      this._context.drawImage(
        color,
        sx,
        sy,
        this._charWidth,
        this._charHeight,
        x * this._charWidth * this._scale,
        y * this._charHeight * this._scale,
        this._charWidth * this._scale,
        this._charHeight * this._scale
      );
    });
  }

  pixelToChar(pixel: Vector2): Vector2 {
    return {
      x: Math.floor(pixel.x / this._charWidth),
      y: Math.floor(pixel.y / this._charHeight),
    };
  }

  private getColorFont(color: Color): HTMLCanvasElement {
    // If cached return
    const colorName = color.cssColor();
    const cached = this._fontColorCache.get(colorName);
    if (cached) return cached;

    // Create a font using the given color.
    const tint = window.document.createElement("canvas");
    tint.width = this._font.width;
    tint.height = this._font.height;

    const context = tint.getContext("2d")!;

    // Draw the font
    context.drawImage(this._font, 0, 0);

    // Tint it by filling in the existing alpha with the color
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = color.cssColor();
    context.fillRect(0, 0, this._font.width, this._font.height);

    this._fontColorCache.set(colorName, tint);
    return tint;
  }
}
