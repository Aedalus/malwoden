import { WidgetConfig } from ".";
import { Color } from "../terminal";
import { Widget } from "./widget";

export function truncateText(config: {
  text: string;
  truncateAfter: number;
  addEllipsis: boolean;
}): string {
  if (config.addEllipsis) {
    return `${config.text.substring(0, config.truncateAfter - 3)}...`;
  } else {
    return config.text.substring(0, config.truncateAfter);
  }
}

export function wrapText(config: { text: string; wrapAt: number }): string[] {
  const lines: string[] = [];
  const words = config.text.split(" ");

  let current = "";
  while (words.length) {
    const next = words.shift()!;
    const nextWithSpace = ` ${next}`;

    // ensure we always get at least one word
    if (current === "") {
      current += next;
      continue;
    } else if (current.length + nextWithSpace.length > config.wrapAt) {
      // if we need to line break
      lines.push(current);
      current = next;
    } else {
      // otherwise add it on
      current += nextWithSpace;
    }
  }

  if (current.length) {
    lines.push(current);
  }
  return lines;
}

/**
 * The State of a TextWidget
 */
export interface TextWidgetState {
  /** The text to display */
  text: string;

  // Colors
  /** The color to use for the text. Default White. */
  foreColor?: Color;
  /** The color to use for the background. Default Black*/
  backColor?: Color;

  // Truncate
  /** Truncate the text after this amount */
  truncateAfter?: number;
  /** Change the last three chars of a truncated text to ... */
  truncateAddEllipsis?: boolean;
  /** Wrap the text after this number */
  wrapAt?: number;
}

/**
 * Represents text to draw to the screen, potentially truncated or wrapped.
 */
export class TextWidget extends Widget<TextWidgetState> {
  constructor(config: WidgetConfig<TextWidgetState>) {
    super(config);
    this.state = {
      foreColor: Color.White,
      backColor: Color.Black,
      ...config.initialState,
    };
  }
  private getLines(text: string): string[] {
    if (this.state.wrapAt) return wrapText({ text, wrapAt: this.state.wrapAt });
    else return [text];
  }

  private getText(): string {
    if (this.state.truncateAfter === undefined) return this.state.text;

    return truncateText({
      text: this.state.text,
      truncateAfter: this.state.truncateAfter,
      addEllipsis: !!this.state.truncateAddEllipsis,
    });
  }

  onDraw(): void {
    if (!this.terminal) return;

    const origin = this.getAbsoluteOrigin();

    const text = this.getText();
    const lines = this.getLines(text);

    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      this.terminal.writeAt(
        { x: origin.x, y: origin.y + y },
        line,
        this.state.foreColor,
        this.state.backColor
      );
    }
  }
}
