import { Color } from "../terminal";
import { Widget } from "./widget";

export function truncateText(config: {
  text: string;
  truncateAfter: number;
  truncateUseEllipsis: boolean;
}): string {
  if (config.truncateUseEllipsis) {
    return `${config.text.substring(0, config.truncateAfter - 3)}...`;
  } else {
    return config.text.substring(0, config.truncateAfter);
  }
}

interface TextWidgetState {
  text: string;

  // Colors
  foreColor?: Color;
  backColor?: Color;

  // Truncate
  truncateAfter?: number;
  truncateUseEllipsis?: boolean;
}

export class TextWidget<D> extends Widget<TextWidgetState, D> {
  render(): void {
    const origin = this.getAbsoluteOrigin();

    let text = this.state.text;
    if (this.state.truncateAfter !== undefined) {
      text = truncateText({
        text: this.state.text,
        truncateAfter: this.state.truncateAfter,
        truncateUseEllipsis: !!this.state.truncateUseEllipsis,
      });
    }

    this.terminal.writeAt(
      origin,
      text,
      this.state.foreColor,
      this.state.backColor
    );
  }
}
