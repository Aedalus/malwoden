import { Rect, IRect } from "../util/rect";

interface BSPTreeRectConfig extends IRect {
  depth: number;
}

export class BSPTreeRect extends Rect {
  depth: number;
  subRectA?: BSPTreeRect;
  subRectB?: BSPTreeRect;

  constructor(config: BSPTreeRectConfig) {
    super(config);
    this.depth = config.depth;
  }

  split() {
    if (Math.random() > 0.5) {
      this.splitVertical();
    } else {
      this.splitHorizontal();
    }
  }

  splitVertical() {
    if (this.subRectA || this.subRectB) throw new Error("Tried to re-split a BSPTreeRect");

    const splitY = Math.floor((this.y1 + this.y2) / 2);

    this.subRectA = new BSPTreeRect({
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: splitY,
      depth: this.depth + 1,
    });

    this.subRectB = new BSPTreeRect({
      x1: this.x1,
      y1: splitY + 1,
      x2: this.x2,
      y2: this.y2,
      depth: this.depth + 1,
    });
  }

  splitHorizontal() {
    if (this.subRectA || this.subRectB) throw new Error("Tried to re-split a BSPTreeRect");

    const splitX = Math.floor((this.x1 + this.x2) / 2);

    this.subRectA = new BSPTreeRect({
      x1: this.x1,
      y1: this.y1,
      x2: splitX,
      y2: this.y2,
      depth: this.depth + 1,
    });

    this.subRectB = new BSPTreeRect({
      x1: splitX + 1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      depth: this.depth + 1,
    });
  }

  splitUntil(depth: number): BSPTreeRect[] {
    const horizon: BSPTreeRect[] = [this];
    const final: BSPTreeRect[] = [];

    while (horizon.length > 0) {
      const r = horizon.pop()!;
      if (r.depth > depth) continue;
      if (r.depth === depth) {
        final.push(r);
        continue;
      }

      r.split();
      horizon.push(r.subRectA!);
      horizon.push(r.subRectB!);
    }

    return final;
  }
}

interface BSPTreeConfig {
  initRect: BSPTreeRect;
  // Controls how evenly rooms are split
  //   splitVarianceX?: number;
  //   splitVarianceY?: number;
}

export class BSPTree {
  readonly initRect: BSPTreeRect;
  //   readonly splitVarianceX: number;

  constructor(config: BSPTreeConfig) {
    this.initRect = config.initRect;
  }
}
