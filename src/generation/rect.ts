import { AleaRNG, RNG } from "../rand";
import { IRect, Rect } from "../util/rect";

interface SubRectOptions {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  rng?: RNG;
}

export class RectGen {
  static SubRect(rect: IRect, config: SubRectOptions): Rect {
    const r1 = new Rect(rect);
    if (r1.width() < config.minWidth)
      throw new Error("error generating sub rect: width too small");
    if (r1.height() < config.minHeight)
      throw new Error("error generating sub rect: height too small");

    const rng = config.rng || new AleaRNG();

    // ToDo - Implement
    const width = rng.nextInt(config.minWidth, config.maxWidth);
    const height = rng.nextInt(config.minHeight, config.maxHeight);

    const x1Max = rect.x2 - width;
    const y1Max = rect.y2 - height;

    const x1 = rng.nextInt(rect.x1, x1Max);
    const y1 = rng.nextInt(rect.y1, y1Max);

    return Rect.fromWidthHeight(x1, y1, width, height);
  }
}
