import { Vector2 } from "../struct";
import { BaseTerminal, CharCode, Color, Glyph } from "../terminal";
import { Widget, WidgetConfig, WidgetDrawCtx } from "./widget";

export interface PanelWidgetState {
  // Bounds
  width: number;
  height: number;

  // Colors
  foreColor?: Color;
  backColor?: Color;

  // Borders
  borderStyle?: "double-bar";
}

export class PanelWidget<D> extends Widget<PanelWidgetState, D> {
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

  private getAbsTopRight(): Vector2 {
    const o = this.getAbsoluteOrigin();
    return {
      x: o.x + this.state.width - 1,
      y: o.y,
    };
  }

  private getAbsBottomLeft(): Vector2 {
    const o = this.getAbsoluteOrigin();
    return {
      x: o.x,
      y: o.y + this.state.height - 1,
    };
  }

  private getAbsBottomRight(): Vector2 {
    const o = this.getAbsoluteOrigin();
    return {
      x: o.x + this.state.width - 1,
      y: o.y + this.state.height - 1,
    };
  }

  private renderBorder(terminal: BaseTerminal) {
    const origin = this.getAbsoluteOrigin();
    const { foreColor, backColor } = this.state;

    const topLeftCorner = this.getAbsTopLeft();
    const topRightCorner = this.getAbsTopRight();
    const bottomRightCorner = this.getAbsBottomRight();
    const bottomLeftCorner = this.getAbsBottomLeft();

    // Corners
    terminal.drawGlyph(
      topLeftCorner,
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleDownAndRight,
        foreColor,
        backColor
      )
    );
    terminal.drawGlyph(
      topRightCorner,
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleDownAndLeft,
        foreColor,
        backColor
      )
    );
    terminal.drawGlyph(
      bottomLeftCorner,
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleUpAndRight,
        foreColor,
        backColor
      )
    );
    terminal.drawGlyph(
      bottomRightCorner,
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleUpAndLeft,
        foreColor,
        backColor
      )
    );

    // Horizontal Bars
    for (let dx = origin.x + 1; dx < topRightCorner.x; dx++) {
      terminal.drawGlyph(
        { x: dx, y: origin.y },
        Glyph.fromCharCode(
          CharCode.boxDrawingsDoubleHorizontal,
          foreColor,
          backColor
        )
      );
      //bottom width bar.
      terminal.drawGlyph(
        { x: dx, y: bottomRightCorner.y },
        Glyph.fromCharCode(
          CharCode.boxDrawingsDoubleHorizontal,
          foreColor,
          backColor
        )
      );
    }

    // Vertical Bars
    for (let dy = origin.y + 1; dy < bottomLeftCorner.y; dy++) {
      terminal.drawGlyph(
        { x: origin.x, y: dy },
        Glyph.fromCharCode(
          CharCode.boxDrawingsDoubleVertical,
          foreColor,
          backColor
        )
      );
      terminal.drawGlyph(
        { x: topRightCorner.x, y: dy },
        Glyph.fromCharCode(
          CharCode.boxDrawingsDoubleVertical,
          foreColor,
          backColor
        )
      );
    }
  }

  onDraw(ctx: WidgetDrawCtx): void {
    const { backColor, foreColor } = this.state;

    const bgGlyph = new Glyph(" ", foreColor, backColor);
    const tl = this.getAbsTopLeft();
    const br = this.getAbsBottomRight();
    ctx.terminal.fill(tl, br, bgGlyph);

    if (this.state.borderStyle) {
      this.renderBorder(ctx.terminal);
    }
  }
}
