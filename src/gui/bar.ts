import { Vector2 } from "../struct";
import { BaseTerminal, CharCode, Color, Glyph } from "../terminal";

type RoundType = "up" | "down" | "default";

interface GUIBarOptions {
  origin: Vector2;
  width: number;
  minValue?: number;
  maxValue: number;
  currentValue: number;
  foreGlyph?: Glyph;
  backGlyph?: Glyph;
  roundType?: RoundType;
}

function getRoundedPercent(percent: number, divisor: number, round: RoundType) {
  let roundFunc = Math.round;
  if (round === "up") {
    roundFunc = Math.ceil;
  } else if (round === "down") {
    roundFunc = Math.floor;
  }

  return roundFunc(percent * divisor) / divisor;
}

export function bar(terminal: BaseTerminal, options: GUIBarOptions) {
  const {
    origin,
    width,
    minValue = 0,
    maxValue,
    currentValue,
    foreGlyph = Glyph.fromCharCode(CharCode.fullBlock, Color.White),
    backGlyph = Glyph.fromCharCode(CharCode.fullBlock, Color.Gray),
    roundType: round = "default",
  } = options;

  const percent = (currentValue - minValue) / (maxValue - minValue);
  const roundedPercent = getRoundedPercent(percent, width + 1, round);

  for (let x = origin.x; x <= origin.x + width; x++) {
    const p = (x - origin.x) / width;
    if (p <= roundedPercent) {
      terminal.drawGlyph({ x, y: origin.y }, foreGlyph);
    } else {
      terminal.drawGlyph({ x, y: origin.y }, backGlyph);
    }
  }
}
