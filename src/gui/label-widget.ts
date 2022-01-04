import { CharCode } from "../terminal";
import { Color } from "../terminal/color";
import { Widget } from "./widget";

export interface LabelWidgetState {
  text: string;
  direction: "left" | "right";

  // Colors
  foreColor?: Color;
  backColor?: Color;
}

export class LabelWidget<D> extends Widget<LabelWidgetState, D> {
  private renderLeftLabel(): void {
    const origin = this.getAbsoluteOrigin();
    const { text, foreColor, backColor } = this.state;
    const start = { x: origin.x - text.length - 2, y: origin.y };
    this.terminal.writeAt(start, text, foreColor, backColor);
    this.terminal.drawCharCode(
      { x: start.x + text.length, y: origin.y },
      CharCode.fullBlock,
      backColor
    );
    this.terminal.drawCharCode(
      { x: start.x + text.length + 1, y: origin.y },
      CharCode.rightwardsArrow,
      backColor,
      foreColor
    );
  }

  private renderRightLabel(): void {
    const origin = this.getAbsoluteOrigin();
    const { text, foreColor, backColor } = this.state;
    const start = { x: origin.x + 1, y: origin.y };
    this.terminal.drawCharCode(
      start,
      CharCode.leftwardsArrow,
      backColor,
      foreColor
    );
    this.terminal.drawCharCode(
      { x: start.x + 1, y: start.y },
      CharCode.fullBlock,
      backColor,
      foreColor
    );
    this.terminal.writeAt(
      { x: start.x + 2, y: start.y },
      text,
      foreColor,
      backColor
    );
  }

  render(): void {
    if (this.state.direction === "left") {
      this.renderLeftLabel();
    } else {
      this.renderRightLabel();
    }
  }
}
