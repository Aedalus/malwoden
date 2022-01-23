import { MouseHandler, MouseHandlerEvent } from "../input";
import { Rect } from "../struct";
import { BaseTerminal, CharCode, Color, Glyph } from "../terminal";
import { Widget, WidgetConfig } from "./widget";
import * as Calc from "../calc";
import { BorderStyles, drawBorder } from "./util/draw-borders";

export interface ButtonWidgetState {
  text: string;
  backColor?: Color;
  foreColor?: Color;
  hoverColor?: Color;
  downColor?: Color;
  padding?: number;

  onClick?: () => void;
  mouseButton?: number;

  borderStyle?: BorderStyles;
}

export enum HoverState {
  None = 0,
  Hover = 1,
  Down = 2,
}

export class ButtonWidget extends Widget<ButtonWidgetState> {
  constructor(config: WidgetConfig<ButtonWidgetState>) {
    super(config);
    this.state = {
      foreColor: Color.White,
      hoverColor: Color.DarkGray,
      downColor: Color.Black,
      backColor: Color.Black,
      padding: 0,
      ...config.initialState,
    };
  }

  private getPadding(): number {
    return this.state.padding ?? 0;
  }

  private getBounds(): Rect {
    return Rect.FromWidthHeight(
      this.absoluteOrigin,
      this.getPadding() * 2 + this.state.text.length,
      this.getPadding() * 2 + 1
    );
  }

  private getMouseStateFromMouseHandler(
    mouseHandler?: MouseHandler,
    terminal?: BaseTerminal
  ): HoverState {
    if (!mouseHandler || !terminal) return HoverState.None;

    const mousePos = mouseHandler.getPos();
    const terminalPos = terminal.windowToTilePoint(mousePos);
    const mouseDown = mouseHandler.isMouseDown();

    if (this.getBounds().contains(terminalPos)) {
      if (mouseDown) {
        return HoverState.Down;
      } else {
        return HoverState.Hover;
      }
    } else {
      return HoverState.None;
    }
  }

  private getBackColor(mouseState: HoverState): Color | undefined {
    if (mouseState === HoverState.None) {
      return this.state.backColor;
    }

    if (mouseState === HoverState.Hover) {
      return this.state.hoverColor;
    }

    if (mouseState === HoverState.Down) {
      return this.state.downColor;
    }
  }

  onMouseClick(event: MouseHandlerEvent): boolean {
    if (!this.terminal || !this.state.onClick) return false;
    const tilePos = this.terminal.windowToTilePoint(event);
    if (this.getBounds().contains(tilePos)) {
      this.state.onClick();
      return true;
    }
    return false;
  }

  onDraw(): void {
    if (!this.terminal) return;

    const bounds = this.getBounds();

    const hoverState = this.getMouseStateFromMouseHandler(
      this.mouseHandler,
      this.terminal
    );
    const backColor = this.getBackColor(hoverState);

    const g = Glyph.fromCharCode(
      CharCode.space,
      this.state.foreColor,
      backColor
    );

    for (let y = bounds.v1.y; y <= bounds.v2.y; y++) {
      for (let x = bounds.v1.x; x <= bounds.v2.x; x++) {
        this.terminal.drawGlyph({ x, y }, g);
      }
    }

    this.terminal.writeAt(
      Calc.Vector.add(bounds.v1, {
        x: this.getPadding(),
        y: this.getPadding(),
      }),
      this.state.text,
      this.state.foreColor,
      backColor
    );

    // Draw borders
    if (this.getPadding() > 0 && this.state.borderStyle) {
      drawBorder({
        terminal: this.terminal,
        style: this.state.borderStyle,
        foreColor: this.state.foreColor,
        backColor,
        bounds: this.getBounds(),
      });
    }
  }
}
