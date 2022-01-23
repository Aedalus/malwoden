import { Rect } from "../../struct";
import { BaseTerminal, CharCode, Color, Glyph } from "../../terminal";

export type BorderStyles = "double-bar" | "single-bar";

interface BorderStyleTiles {
  topLeftCorner: CharCode;
  topRightCorner: CharCode;
  bottomLeftCorner: CharCode;
  bottomRightCorner: CharCode;
  verticalBarsLeft: CharCode;
  verticalBarsRight: CharCode;
  horizontalBarsTop: CharCode;
  horizontalBarsBottom: CharCode;
}

const tileMap: { [style in BorderStyles]: BorderStyleTiles } = {
  "double-bar": {
    topLeftCorner: CharCode.boxDrawingsDoubleDownAndRight,
    topRightCorner: CharCode.boxDrawingsDoubleDownAndLeft,
    bottomLeftCorner: CharCode.boxDrawingsDoubleUpAndRight,
    bottomRightCorner: CharCode.boxDrawingsDoubleUpAndLeft,
    verticalBarsLeft: CharCode.boxDrawingsDoubleVertical,
    verticalBarsRight: CharCode.boxDrawingsDoubleVertical,
    horizontalBarsTop: CharCode.boxDrawingsDoubleHorizontal,
    horizontalBarsBottom: CharCode.boxDrawingsDoubleHorizontal,
  },
  "single-bar": {
    topLeftCorner: CharCode.boxDrawingsLightDownAndRight,
    topRightCorner: CharCode.boxDrawingsLightDownAndLeft,
    bottomLeftCorner: CharCode.boxDrawingsLightUpAndRight,
    bottomRightCorner: CharCode.boxDrawingsLightUpAndLeft,
    verticalBarsLeft: CharCode.boxDrawingsLightVertical,
    verticalBarsRight: CharCode.boxDrawingsLightVertical,
    horizontalBarsTop: CharCode.boxDrawingsLightHorizontal,
    horizontalBarsBottom: CharCode.boxDrawingsLightHorizontal,
  },
};

export function drawBorder(borderOptions: {
  terminal: BaseTerminal;
  foreColor?: Color;
  backColor?: Color;
  bounds: Rect;
  style: "double-bar" | "single-bar";
}) {
  const { terminal, foreColor, backColor, bounds, style } = borderOptions;

  const topLeftCorner = bounds.v1;
  const topRightCorner = { x: bounds.v2.x, y: bounds.v1.y };
  const bottomLeftCorner = { x: bounds.v1.x, y: bounds.v2.y };
  const bottomRightCorner = bounds.v2;

  const tiles = tileMap[style];

  // Corners
  terminal.drawGlyph(
    topLeftCorner,
    Glyph.fromCharCode(tiles.topLeftCorner, foreColor, backColor)
  );
  terminal.drawGlyph(
    topRightCorner,
    Glyph.fromCharCode(tiles.topRightCorner, foreColor, backColor)
  );
  terminal.drawGlyph(
    bottomLeftCorner,
    Glyph.fromCharCode(tiles.bottomLeftCorner, foreColor, backColor)
  );
  terminal.drawGlyph(
    bottomRightCorner,
    Glyph.fromCharCode(tiles.bottomRightCorner, foreColor, backColor)
  );

  // Horizontal Bars
  for (let dx = topLeftCorner.x + 1; dx < topRightCorner.x; dx++) {
    terminal.drawGlyph(
      { x: dx, y: topLeftCorner.y },
      Glyph.fromCharCode(tiles.horizontalBarsTop, foreColor, backColor)
    );
    terminal.drawGlyph(
      { x: dx, y: bottomRightCorner.y },
      Glyph.fromCharCode(tiles.horizontalBarsBottom, foreColor, backColor)
    );
  }

  // Vertical Bars
  for (let dy = topLeftCorner.y + 1; dy < bottomLeftCorner.y; dy++) {
    terminal.drawGlyph(
      { x: topLeftCorner.x, y: dy },
      Glyph.fromCharCode(tiles.verticalBarsLeft, foreColor, backColor)
    );
    terminal.drawGlyph(
      { x: topRightCorner.x, y: dy },
      Glyph.fromCharCode(tiles.verticalBarsRight, foreColor, backColor)
    );
  }
}
