import { WidgetConfig } from ".";
import { BaseTerminal, CharCode } from "../terminal";
import { Color } from "../terminal/color";
import { Widget } from "./widget";

export interface LabelWidgetState {
  /** The text to display, should be short. */
  text: string;

  /** The direction the text should be, relative to the origin. */
  direction: "left" | "right";

  // Colors
  /** The primary color of the label. Default white. */
  foreColor?: Color;
  /** The secondary color of the label. Default black. */
  backColor?: Color;
}

/**
 * Represents a label drawn on the screen, often for help text.
 * The direction can be controlled to make sure the label doesn't
 * get cut off on the edge of the screen.
 */
export class LabelWidget extends Widget<LabelWidgetState> {
  constructor(config: WidgetConfig<LabelWidgetState>) {
    super(config);
    this.state = {
      foreColor: Color.White,
      backColor: Color.Black,
      ...config.initialState,
    };
  }
  private renderLeftLabel(terminal: BaseTerminal): void {
    const origin = this.getAbsoluteOrigin();
    const { text, foreColor, backColor } = this.state;
    const start = { x: origin.x - text.length - 2, y: origin.y };

    terminal.writeAt(start, text, foreColor, backColor);
    terminal.drawCharCode(
      { x: start.x + text.length, y: origin.y },
      CharCode.fullBlock,
      backColor
    );
    terminal.drawCharCode(
      { x: start.x + text.length + 1, y: origin.y },
      CharCode.rightwardsArrow,
      backColor,
      foreColor
    );
  }

  private renderRightLabel(terminal: BaseTerminal): void {
    const origin = this.getAbsoluteOrigin();
    const { text, foreColor, backColor } = this.state;
    const start = { x: origin.x + 1, y: origin.y };

    terminal.drawCharCode(start, CharCode.leftwardsArrow, backColor, foreColor);
    terminal.drawCharCode(
      { x: start.x + 1, y: start.y },
      CharCode.fullBlock,
      backColor,
      foreColor
    );
    terminal.writeAt(
      { x: start.x + 2, y: start.y },
      text,
      foreColor,
      backColor
    );
  }

  onDraw(): void {
    if (!this.terminal) return;
    if (this.state.direction === "left") {
      this.renderLeftLabel(this.terminal);
    } else {
      this.renderRightLabel(this.terminal);
    }
  }
}
