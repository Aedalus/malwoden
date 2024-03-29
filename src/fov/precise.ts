import * as Calc from "../calc";
import { Vector2 } from "../struct/vector";
import { getRing4, getRing8 } from "./get-ring";

type RationalNum = [number, number];

interface LightPassesCallback {
  (pos: Vector2): boolean;
}

interface VisibilityCallback {
  (pos: Vector2, range: number, visibility: number): void;
}

interface VisibilityStruct {
  pos: Vector2;
  r: number;
  visibility: number;
}

interface PreciseShadowcastingConfig {
  lightPasses: LightPassesCallback;
  topology: "four" | "eight";
  returnAll?: boolean;
  cartesianRange?: boolean;
}

/** FOV Algorithm that calculates angles of shadows and merges them together. */
export class PreciseShadowcasting {
  private lightPasses: LightPassesCallback;
  private getRing: typeof getRing4;
  private returnAll: boolean;
  private cartesianRange: boolean;

  /**
   * Creates a new PreciseShadowcasting object
   * which can calulate viewsheds.
   *
   * @param config
   * @param config.lightPasses Vector2 => Boolean - Whether a position is visible
   * @param config.topology "four" | "eight" | "free" - The topology to use
   * @param config.returnAll Return all spaces in range, even if not visible. Default false.
   * @param config.cartesianRange If set, will calculate range as a^2 + b^2 = c^2. Results in round shape. Default false.
   */
  constructor(config: PreciseShadowcastingConfig) {
    this.lightPasses = config.lightPasses;
    // free uses an 8 ring topology
    this.getRing = config.topology === "four" ? getRing4 : getRing8;
    this.returnAll = config.returnAll ?? false;
    this.cartesianRange = config.cartesianRange ?? false;
  }

  /**
   * Calculates an array of visible Vectors. Same as calculateCallback,
   * but returns an Array instead.
   *
   * @param origin Vector2 - The position to start from.
   * @param range Number - The range of vision
   */
  calculateArray(origin: Vector2, range: number): VisibilityStruct[] {
    const v: VisibilityStruct[] = [];
    this.calculateCallback(origin, range, (pos, r, visibility) => {
      v.push({ pos, r, visibility });
    });
    return v;
  }

  /**
   * Calculates visible positions, and invokes the given callback for each one.
   *
   * @param origin Vector2 - The position to start from
   * @param range Number - The range of vision
   * @param callback (pos: Vector2, range: number, visibility: number) => void - The function to call for each visible tile
   */
  calculateCallback(
    origin: Vector2,
    range: number,
    callback: VisibilityCallback
  ) {
    // Always call the original
    callback(origin, 0, 1);

    const shadows: RationalNum[] = [];

    // For all rings
    for (let r = 1; r <= range; r++) {
      const ring = this.getRing(origin.x, origin.y, r);
      // * by 2 here since we're making 2 arcs per tile
      const arcCount = ring.length * 2;

      // For all cells
      for (let i = 0; i < ring.length; i++) {
        let cell = ring[i];
        // If it's the first angle, we shift the negative value to a positive one.
        // i.e. -1/8 -> 7/8
        const lesserN = i === 0 ? arcCount - 1 : 2 * i - 1;
        // ToDo - Fix naming
        const lesserAngle = [lesserN, arcCount];
        const greaterAngle = [2 * i + 1, arcCount];

        const blocks = this.lightPasses(cell) === false;
        const visibility = this.checkVisibility(
          lesserAngle as RationalNum,
          greaterAngle as RationalNum,
          blocks,
          shadows
        );
        if (visibility || this.returnAll) {
          if (this.cartesianRange) {
            const absRange = Calc.Vector.getDistance(origin, cell);
            if (absRange <= range) {
              callback(cell, r, visibility);
            }
          } else {
            callback(cell, r, visibility);
          }
        }
        // ToDo - Short circuit if entirely surrounded
      }
    }
  }

  private checkVisibility(
    A1: RationalNum,
    A2: RationalNum,
    blocks: boolean,
    shadows: RationalNum[]
  ): number {
    if (A1[0] > A2[0]) {
      /* split into two sub-arcs */
      let v1 = this.checkVisibility(A1, [A1[1], A1[1]], blocks, shadows);
      let v2 = this.checkVisibility([0, 1], A2, blocks, shadows);
      return (v1 + v2) / 2;
    }

    /* index1: first shadow >= A1 */
    let index1 = 0,
      edge1 = false;
    while (index1 < shadows.length) {
      let old = shadows[index1];
      let diff = old[0] * A1[1] - A1[0] * old[1];
      if (diff >= 0) {
        /* old >= A1 */
        if (diff == 0 && !(index1 % 2)) {
          edge1 = true;
        }
        break;
      }
      index1++;
    }

    /* index2: last shadow <= A2 */
    let index2 = shadows.length,
      edge2 = false;
    while (index2--) {
      let old = shadows[index2];
      let diff = A2[0] * old[1] - old[0] * A2[1];
      if (diff >= 0) {
        /* old <= A2 */
        if (diff == 0 && index2 % 2) {
          edge2 = true;
        }
        break;
      }
    }

    let visible = this.checkShadowVisibility(index1, index2, edge1, edge2);
    if (!visible) {
      return 0;
    } /* fast case: not visible */

    let visibleLength;

    /* compute the length of visible arc, adjust list of shadows (if blocking) */
    let remove = index2 - index1 + 1;
    if (remove % 2) {
      if (index1 % 2) {
        /* first edge within existing shadow, second outside */
        let P = shadows[index1];
        visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
        if (blocks) {
          shadows.splice(index1, remove, A2);
        }
      } else {
        /* second edge within existing shadow, first outside */
        let P = shadows[index2];
        visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
        if (blocks) {
          shadows.splice(index1, remove, A1);
        }
      }
    } else {
      if (index1 % 2) {
        /* both edges within existing shadows */
        let P1 = shadows[index1];
        let P2 = shadows[index2];
        visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
        if (blocks) {
          shadows.splice(index1, remove);
        }
      } else {
        /* both edges outside existing shadows */
        if (blocks) {
          shadows.splice(index1, remove, A1, A2);
        }
        return 1; /* whole arc visible! */
      }
    }

    let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);

    return visibleLength / arcLength;
  }

  private checkShadowVisibility(
    index1: number,
    index2: number,
    edge1: boolean,
    edge2: boolean
  ): boolean {
    let visible = true;
    if (index1 == index2 && (edge1 || edge2)) {
      /* subset of existing shadow, one of the edges match */
      visible = false;
    } else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
      /* completely equivalent with existing shadow */
      visible = false;
    } else if (index1 > index2 && index1 % 2) {
      /* subset of existing shadow, not touching */
      visible = false;
    }
    return visible;
  }
}
