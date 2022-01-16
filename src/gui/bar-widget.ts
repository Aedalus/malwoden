import { CharCode, Color, Glyph } from "../terminal";
import { Widget, WidgetConfig, WidgetDrawCtx } from "./widget";

export type RoundMode = "up" | "down" | "default";

export interface BarWidgetState {
  // Bounds
  width: number;

  // values
  minValue?: number;
  maxValue: number;
  currentValue?: number;
  roundMode?: RoundMode;

  // Glyphs
  foreGlyph?: Glyph;
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

export class BarWidget<D> extends Widget<BarWidgetState, D> {
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
