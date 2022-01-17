import { CharCode, Color, Glyph } from "../terminal";
import { Widget, WidgetConfig, WidgetDrawCtx } from "./widget";

export type RoundMode = "up" | "down" | "default";

export interface BarWidgetState {
  // Bounds
  /** The width of the bar */
  width: number;

  // values
  /** The minimum value allowed. Default 0. */
  minValue?: number;
  /** The maximum value allowed. */
  maxValue: number;
  /** The current value. Default 0. */
  currentValue?: number;
  /** The mode to use for rounding. up | down | default */
  roundMode?: RoundMode;

  // Glyphs
  /** An optional glyph to use for each filled square. Default white square. */
  foreGlyph?: Glyph;
  /** An optional glyph to use for each empty square. Default gray. */
  backGlyph?: Glyph;
}

export function getRoundedPercent(
  percent: number,
  divisor: number,
  round: RoundMode
) {
  let roundFunc = Math.round;
  if (round === "up") {
    roundFunc = Math.ceil;
  } else if (round === "down") {
    roundFunc = Math.floor;
  }

  return roundFunc(percent * divisor) / divisor;
}

/**
 * Represents a bar, like in a loading/progress indicator
 * or hp bar.
 */
export class BarWidget extends Widget<BarWidgetState> {
  state: Required<BarWidgetState>;

  constructor(config: WidgetConfig<BarWidgetState>) {
    super(config);

    this.state = {
      roundMode: "default",
      minValue: 0,
      currentValue: 0,
      foreGlyph: Glyph.fromCharCode(CharCode.fullBlock, Color.White),
      backGlyph: Glyph.fromCharCode(CharCode.fullBlock, Color.Gray),
      ...config.initialState,
    };
  }

  onDraw(ctx: WidgetDrawCtx): void {
    const origin = this.getAbsoluteOrigin();
    const percent =
      (this.state.currentValue - this.state.minValue!) /
      (this.state.maxValue - this.state.minValue!);
    const roundedPercent = getRoundedPercent(
      percent,
      this.state.width + 1,
      this.state.roundMode!
    );

    for (let x = origin.x; x <= origin.x + this.state.width; x++) {
      const p = (x - origin.x) / this.state.width;
      if (p <= roundedPercent) {
        ctx.terminal.drawGlyph({ x, y: origin.y }, this.state.foreGlyph);
      } else {
        ctx.terminal.drawGlyph({ x, y: origin.y }, this.state.backGlyph);
      }
    }
  }
}
