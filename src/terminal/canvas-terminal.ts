import { RenderableTerminal, TerminalConfig } from "./terminal";
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

interface CanvasTerminalConfig extends TerminalConfig {
  font: Font;
  mountNode?: HTMLElement;
}

/**
 * Renders a display by writing fonts to a canvas.
 */
export class CanvasTerminal extends RenderableTerminal {
  readonly display: Display;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  readonly font: Font;
  readonly scale: number = window.devicePixelRatio;

  /**
   * Creates a new CanvasTerminal.
   *
   * @param config - The config for the CanvasTerminal
   * @param config.width - The width of the terminal in characters.
   * @param config.height - The height of the terminal in characters.
   * @param config.font Font - A font object
   * @param config.mountNode - Will mount the canvas as a child of this node if provided.
   */
  constructor(config: CanvasTerminalConfig) {
    super(config);
    this.display = new Display(config.width, config.height);
    this.font = config.font;
    this.canvas = window.document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    const canvasWidth = this.font.charWidth * this.display.width;
    const canvasHeight = this.font.lineHeight * this.display.height;
    this.canvas.width = canvasWidth * this.scale;
    this.canvas.height = canvasHeight * this.scale;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;

    // Mount the canvas
    if (config.mountNode) {
      config.mountNode.appendChild(this.canvas);
    } else {
      window.document.body.appendChild(this.canvas);
    }
  }

  /**
   * Draws a glyph on the display.
   *
   * @param pos Vector2 - Position of the Glyph
   * @param glyph Glyph - The Glyph to render
   */
  drawGlyph(pos: Vector2, glyph: Glyph) {
    this.display.setGlyph(pos, glyph);
  }

  /**
   * Renders the display to the canvas.
   * Usually drawn once per animation frame.
   */
  render() {
    this.context.font = `${this.font.size * this.scale}px ${
      this.font.family
    }, monospace`;

    this.display.render((pos, glyph) => {
      // Fill the background
      this.context.fillStyle = glyph.back.cssColor();
      this.context.fillRect(
        pos.x * this.font.charWidth * this.scale,
        pos.y * this.font.lineHeight * this.scale,
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
        (pos.x * this.font.charWidth + this.font.x) * this.scale,
        (pos.y * this.font.lineHeight + this.font.y) * this.scale
      );
    });
  }

  /**
   * Returns the character position given a pixel coordinate.
   */
  pixelToChar(pixel: Vector2): Vector2 {
    return {
      x: Math.floor(pixel.x / this.font.charWidth),
      y: Math.floor(pixel.y / this.font.lineHeight),
    };
  }

  /**
   * Deletes the terminal, removing the canvas.
   */
  delete() {
    this.canvas.parentNode?.removeChild(this.canvas);
  }
}
