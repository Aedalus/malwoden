import { BaseTerminal, CharCode, Color } from "../terminal";
import { Vector2 } from "../util";

interface GUILabelOptions {
  pos: Vector2;
  text: string;
  direction: "left" | "right";
  foreColor?: Color;
  backColor?: Color;
}

export function label(terminal: BaseTerminal, options: GUILabelOptions) {
  const {
    pos,
    text,
    direction,
    foreColor = Color.White,
    backColor = Color.Gray,
  } = options;

  if (direction === "left") {
    const start = { x: pos.x - text.length - 2, y: pos.y };
    terminal.writeAt(start, text, foreColor, backColor);
    terminal.drawCharCode(
      { x: start.x + text.length, y: pos.y },
      CharCode.fullBlock,
      backColor
    );
    terminal.drawCharCode(
      { x: start.x + text.length + 1, y: pos.y },
      CharCode.rightwardsArrow,
      backColor,
      foreColor
    );
  } else {
    const start = { x: pos.x + 1, y: pos.y };
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
}
