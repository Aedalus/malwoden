import { RenderableTerminal, TerminalConfig } from "./terminal";

import { Display } from "./display";
import { Color } from "./color";
import { Glyph } from "./glyph";
import { unicodeMap } from "./unicodemap";
import { CharCode } from "./char-code";
import { Vector2 } from "../util/vector";

interface RetroTerminalConfig extends TerminalConfig {
  charWidth: number;
  charHeight: number;
  imageURL: string;
  mountNode?: HTMLElement;
}

export class RetroTerminal extends RenderableTerminal {
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

  constructor(config: RetroTerminalConfig) {
    super(config);

    this._display = new Display(config.width, config.height);
    this._charWidth = config.charWidth;
    this._charHeight = config.charHeight;
    this._scale = window.devicePixelRatio;

    // Font
    this._font = new Image();
    this._font.src = config.imageURL;

    // Create canvas
    const canvas = window.document.createElement("canvas");
    const canvasWidth = config.charWidth * config.width;
    const canvasHeight = config.charHeight * config.height;
    canvas.width = canvasWidth * this._scale;
    canvas.height = canvasHeight * this._scale;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    if (config.mountNode) {
      config.mountNode.appendChild(canvas);
    } else {
      document.body.appendChild(canvas);
    }

    this._canvas = canvas;
    this._context = canvas.getContext("2d")!;

    this._font.onload = () => {
      this._imageLoaded = true;
      this.render();
    };
  }

  drawGlyph(pos: Vector2, glyph: Glyph): void {
    this._display.setGlyph(pos, glyph);
  }

  render() {
    if (!this._imageLoaded) return;

    this._display.render((pos, glyph) => {
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
        pos.x * this._charWidth * this._scale,
        pos.y * this._charHeight * this._scale,
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
        pos.x * this._charWidth * this._scale,
        pos.y * this._charHeight * this._scale,
        this._charWidth * this._scale,
        this._charHeight * this._scale
      );
    });
  }

  pixelToChar(pixel: Vector2): Vector2 {
    const rect = this._canvas.getBoundingClientRect();
    return {
      x: Math.floor((pixel.x - rect.left) / this._charWidth),
      y: Math.floor((pixel.y - rect.top) / this._charHeight),
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

  /** Deletes the terminal, removing the canvas. */
  delete() {
    this._canvas.parentNode?.removeChild(this._canvas);
  }
}
