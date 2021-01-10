import { BaseTerminal, CharCode, Glyph } from "../terminal";

interface DrawBoxOptions {
  title?: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export function box(terminal: BaseTerminal, options: DrawBoxOptions) {
  const { x1, x2, y1, y2, title } = options;
  // Corners
  terminal.drawGlyph(
    { x: x1, y: y1 },
    Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndRight)
  );
  terminal.drawGlyph(
    { x: x2, y: y1 },
    Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndLeft)
  );
  terminal.drawGlyph(
    { x: x1, y: y2 },
    Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndRight)
  );
  terminal.drawGlyph(
    { x: x2, y: y2 },
    Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndLeft)
  );

  // Horizontal Bars
  for (let dx = x1 + 1; dx < x2; dx++) {
    terminal.drawGlyph(
      { x: dx, y: y1 },
      Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal)
    );
    terminal.drawGlyph(
      { x: dx, y: y2 },
      Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal)
    );
  }

  // Vertical Bars
  for (let dy = y1 + 1; dy < y2; dy++) {
    terminal.drawGlyph(
      { x: x1, y: dy },
      Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical)
    );
    terminal.drawGlyph(
      { x: x2, y: dy },
      Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical)
    );
  }

  if (title) {
    terminal.writeAt({ x: x1 + 2, y: y1 }, ` ${title} `);
  }
}
