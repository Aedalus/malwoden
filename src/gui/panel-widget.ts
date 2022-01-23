import { Rect, Vector2 } from "../struct";
import { BaseTerminal, CharCode, Color, Glyph } from "../terminal";
import { BorderStyles, drawBorder } from "./util/draw-borders";
import { Widget, WidgetConfig } from "./widget";

export interface PanelWidgetState {
  // Bounds
  /** The width of the panel */
  width: number;
  /** The height of the panel */
  height: number;

  // Colors
  /** The color of any border. Default White. */
  foreColor?: Color;
  /** The color of the panel. Default Black */
  backColor?: Color;

  // Borders
  /** An optional border style. Default undefined for none. */
  borderStyle?: BorderStyles;
}

/**
 * Represents a rectangle drawn on the screen, often with a border.
 */
export class PanelWidget extends Widget<PanelWidgetState> {
  constructor(config: WidgetConfig<PanelWidgetState>) {
    super(config);

    this.state = {
      foreColor: Color.White,
      backColor: Color.Black,
      ...config.initialState,
    };
  }

  private getAbsTopLeft(): Vector2 {
    return this.getAbsoluteOrigin();
  }

  private getAbsBottomRight(): Vector2 {
    const o = this.getAbsoluteOrigin();
    return {
      x: o.x + this.state.width - 1,
      y: o.y + this.state.height - 1,
    };
  }

  onDraw(): void {
    if (!this.terminal) return;

    const { backColor, foreColor } = this.state;

    const bgGlyph = new Glyph(" ", foreColor, backColor);
    const tl = this.getAbsTopLeft();
    const br = this.getAbsBottomRight();
    this.terminal.fill(tl, br, bgGlyph);

    if (this.state.borderStyle) {
      drawBorder({
        terminal: this.terminal,
        foreColor,
        backColor,
        style: this.state.borderStyle,
        bounds: new Rect(this.getAbsTopLeft(), this.getAbsBottomRight()),
      });
    }
  }
}
