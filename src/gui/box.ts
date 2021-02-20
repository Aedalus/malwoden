import { BaseTerminal, CharCode, Glyph } from "../terminal";
import { Vector2 } from "../util";
import { Color } from "../terminal/color";

interface DrawBoxOptions {
  title?: string;
  foreColor?: Color;
  barColor?: Color;
  titleColor?: Color;
  backColor?: Color;
  origin: Vector2;
  width: number;
  height: number;
}

export function box(terminal: BaseTerminal, options: DrawBoxOptions) {
  const {
    title,
    barColor,
    titleColor,
    backColor,
    foreColor,
    origin,
    width,
    height,
  } = options;
  const topLeftCorner = origin;
  const topRightCorner = { x: origin.x + width, y: origin.y };
  const bottomRightCorner = { x: origin.x + width, y: origin.y + height };
  const bottomLeftCorner = { x: origin.x, y: origin.y + height };

  terminal.fill(
    origin,
    bottomRightCorner,
    new Glyph(" ", foreColor, backColor)
  );

  // Corners
  terminal.drawGlyph(
    topLeftCorner,
    Glyph.fromCharCode(
      CharCode.boxDrawingsDoubleDownAndRight,
      barColor,
      backColor
    )
  );
  terminal.drawGlyph(
    topRightCorner,
    Glyph.fromCharCode(
      CharCode.boxDrawingsDoubleDownAndLeft,
      barColor,
      backColor
    )
  );
  terminal.drawGlyph(
    bottomLeftCorner,
    Glyph.fromCharCode(
      CharCode.boxDrawingsDoubleUpAndRight,
      barColor,
      backColor
    )
  );
  terminal.drawGlyph(
    bottomRightCorner,
    Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndLeft, barColor, backColor)
  );

  // Horizontal Bars
  //top width bar
  for (let dx = origin.x + 1; dx < topRightCorner.x; dx++) {
    terminal.drawGlyph(
      { x: dx, y: origin.y },
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleHorizontal,
        barColor,
        backColor
      )
    );
    //botom  width bar.
    terminal.drawGlyph(
      { x: dx, y: bottomRightCorner.y },
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleHorizontal,
        barColor,
        backColor
      )
    );
  }

  // Vertical Bars
  for (let dy = origin.y + 1; dy < Math.abs(origin.y + height); dy++) {
    terminal.drawGlyph(
      { x: origin.x, y: dy },
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleVertical,
        barColor,
        backColor
      )
    );
    terminal.drawGlyph(
      { x: topRightCorner.x, y: dy },
      Glyph.fromCharCode(
        CharCode.boxDrawingsDoubleVertical,
        barColor,
        backColor
      )
    );
  }

  if (title) {
    terminal.writeAt(
      { x: origin.x + 2, y: origin.y },
      ` ${title} `,
      titleColor,
      backColor
    );
  }
}
