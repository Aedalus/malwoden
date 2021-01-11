// import { Vector2 } from "../util";
// import { Rect } from "../util/rect";

// interface BSPTreeRectConfig {
//   v1: Vector2;
//   v2: Vector2;
//   depth: number;
// }

// export class BSPTreeRect extends Rect {
//   depth: number;
//   subRectA?: BSPTreeRect;
//   subRectB?: BSPTreeRect;

//   constructor(config: BSPTreeRectConfig) {
//     super(config.v1, config.v2);
//     this.depth = config.depth;
//   }

//   split() {
//     if (Math.random() > 0.5) {
//       this.splitVertical();
//     } else {
//       this.splitHorizontal();
//     }
//   }

//   splitVertical() {
//     if (this.subRectA || this.subRectB)
//       throw new Error("Tried to re-split a BSPTreeRect");

//     const splitY = Math.floor((this.v1.y + this.v2.y) / 2);

//     this.subRectA = new BSPTreeRect({
//       v1: this.v1,
//       v2: {
//         x: this.v2.x,
//         y: splitY,
//       },
//       depth: this.depth + 1,
//     });

//     this.subRectB = new BSPTreeRect({
//       v1: {
//         x: this.v1.x,
//         y: splitY + 1,
//       },
//       v2: this.v2,
//       depth: this.depth + 1,
//     });
//   }

//   splitHorizontal() {
//     if (this.subRectA || this.subRectB)
//       throw new Error("Tried to re-split a BSPTreeRect");

//     const splitX = Math.floor((this.v1.x + this.v2.x) / 2);

//     this.subRectA = new BSPTreeRect({
//       v1: this.v1,
//       v2: {
//         x: splitX,
//         y: this.v2.y,
//       },
//       depth: this.depth + 1,
//     });

//     this.subRectB = new BSPTreeRect({
//       v1: {
//         x: splitX + 1,
//         y: this.v1.y,
//       },
//       v2: this.v2,
//       depth: this.depth + 1,
//     });
//   }

//   splitUntil(depth: number): BSPTreeRect[] {
//     const horizon: BSPTreeRect[] = [this];
//     const final: BSPTreeRect[] = [];

//     while (horizon.length > 0) {
//       const r = horizon.pop()!;
//       if (r.depth > depth) continue;
//       if (r.depth === depth) {
//         final.push(r);
//         continue;
//       }

//       r.split();
//       horizon.push(r.subRectA!);
//       horizon.push(r.subRectB!);
//     }

//     return final;
//   }
// }

// interface BSPTreeConfig {
//   initRect: BSPTreeRect;
//   // Controls how evenly rooms are split
//   //   splitVarianceX?: number;
//   //   splitVarianceY?: number;
// }

// export class BSPTree {
//   readonly initRect: BSPTreeRect;
//   //   readonly splitVarianceX: number;

//   constructor(config: BSPTreeConfig) {
//     this.initRect = config.initRect;
//   }
// }
