// import { WidgetConfig } from ".";
// import { MouseHandler } from "../input";
// import { Calc } from "../malwoden";
// import { Rect } from "../struct";
// import { CharCode, Color, Glyph } from "../terminal";
// import { Widget, WidgetDrawCtx } from "./widget";

// export interface ButtonWidgetState {
//   text: string;
//   backColor: Color;
//   foreColor?: Color;
//   hoverColor?: Color;
//   padding?: number;

//   onClick?: () => void;
//   mouseButton?: number;
// }

// export class ButtonWidget<D> extends Widget<ButtonWidgetState, D> {
//   constructor(config: WidgetConfig<ButtonWidgetState>) {
//     super(config);
//     this.state = {
//       foreColor: Color.White,
//       padding: 0,
//       ...config.initialState,
//     };
//   }

//   private getPadding(): number {
//     return this.state.padding ?? 0;
//   }

//   private getMouseButton(): number {
//     return this.state.mouseButton ?? 0;
//   }

//   isMouseHovering(mouseHandler: MouseHandler): boolean {
//     const mousePos = mouseHandler.getPos();
//     const bounds = this.getBounds();
//     return bounds.contains(mousePos);
//   }

//   private getBounds(): Rect {
//     return Rect.FromWidthHeight(
//       this.absoluteOrigin,
//       this.getPadding() * 2 + this.state.text.length,
//       this.getPadding() * 2 + 1
//     );
//   }

//   private getIsHoveringFromCtx(ctx: WidgetDrawCtx): boolean {
//     if (!ctx.mouse) return false;
//     return this.isMouseHovering(ctx.mouse);
//   }

//   private getBackColor(isHovering: boolean): Color {
//     if (isHovering === false) return this.state.backColor;
//     return this.state.hoverColor ? this.state.hoverColor : this.state.backColor;
//   }

//   onDraw(ctx: WidgetDrawCtx): void {
//     const bounds = this.getBounds();

//     const isHovering = this.getIsHoveringFromCtx(ctx);
//     const backColor = this.getBackColor(isHovering);

//     const g = Glyph.fromCharCode(
//       CharCode.space,
//       this.state.foreColor,
//       backColor
//     );

//     for (let y = bounds.v1.y; y <= bounds.v2.y; y++) {
//       for (let x = bounds.v1.x; x <= bounds.v2.x; x++) {
//         ctx.terminal.drawGlyph({ x, y }, g);
//       }
//     }

//     ctx.terminal.writeAt(
//       Calc.Vector.add(bounds.v1, {
//         x: this.getPadding(),
//         y: this.getPadding(),
//       }),
//       this.state.text,
//       this.state.foreColor,
//       backColor
//     );
//   }
// }
