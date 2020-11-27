import React from "react";
import { Terminal, Glyph, CharCode } from "cacti-term";

function drawDoubleBox(
  terminal: Terminal.BaseTerminal,
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  // Corners
  terminal.drawGlyph(x1, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndRight));
  terminal.drawGlyph(x2, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndLeft));
  terminal.drawGlyph(x1, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndRight));
  terminal.drawGlyph(x2, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndLeft));

  // Horizontal Bars
  for (let dx = x1 + 1; dx < x2; dx++) {
    terminal.drawGlyph(dx, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal));
    terminal.drawGlyph(dx, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal));
  }

  // Vertical Bars
  for (let dy = y1 + 1; dy < y2; dy++) {
    terminal.drawGlyph(x1, dy, Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical));
    terminal.drawGlyph(x2, dy, Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical));
  }
}
export default class Example1 extends React.Component {
  componentDidMount() {
    const terminal = Terminal.Retro.fromURL(80, 50, "font_16.png", 16, 16);
    terminal.clear();
    terminal.writeAt({
      x: 1,
      y: 1,
      text: "foo"
    });
    terminal.writeAt({
      x: 0,
      y: 0,
      text: "bar"
    });
    drawDoubleBox(terminal, 0, 79, 40, 49);
    terminal.writeAt({
      x: 4,
      y: 40,
      text: " Log "
    });
    // terminal.drawGlyph(5, 5, new Glyph("@", Color.yellow));

    terminal.render();
  }
  render() {
    return <div></div>;
  }
}
