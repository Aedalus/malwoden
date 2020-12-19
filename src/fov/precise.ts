import { getRing4, getRing8 } from "./get-ring";

type RationalNum = [number, number];

export function diffRationalNums(a: RationalNum, b: RationalNum): number {
  return a[0] * b[1] - b[0] * a[1];
}

interface LightPassesCallback {
  (x: number, y: number): boolean;
}
interface VisibilityCallback {
  (x: number, y: number, r: number, visibility: number): void;
}
interface VisibilityStruct {
  x: number;
  y: number;
  r: number;
  visibility: number;
}

export class PreciseShadowcasting {
  private lightPasses: LightPassesCallback;
  private getRing: typeof getRing4;

  constructor(
    lightPasses: LightPassesCallback,
    topology: "four" | "eight" = "eight"
  ) {
    this.lightPasses = lightPasses;
    this.getRing = topology === "four" ? getRing4 : getRing8;
  }

  calculateVectors(
    originX: number,
    originY: number,
    range: number
  ): VisibilityStruct[] {
    const v: VisibilityStruct[] = [];
    this.calculateCallback(originX, originY, range, (x, y, r, visibility) => {
      v.push({ x, y, r, visibility });
    });
    return v;
  }

  calculateCallback(
    originX: number,
    originY: number,
    range: number,
    callback: VisibilityCallback
  ) {
    // Always call the original
    callback(originX, originY, 0, 1);

    const shadows: RationalNum[] = [];

    // For all rings
    for (let r = 1; r <= range; r++) {
      const ring = this.getRing(originX, originY, r);
      debugger;
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

        const blocks = this.lightPasses(cell.x, cell.y) === false;
        const visibility = this.checkVisibility(
          lesserAngle as RationalNum,
          greaterAngle as RationalNum,
          blocks,
          shadows
        );
        if (visibility) {
          callback(cell.x, cell.y, r, visibility);
        }
        // ToDo - Short circuit if entirely surrounded
      }
    }
  }

  checkVisibility(
    A1: RationalNum,
    A2: RationalNum,
    blocks: boolean,
    SHADOWS: RationalNum[]
  ): number {
    if (A1[0] > A2[0]) {
      /* split into two sub-arcs */
      let v1 = this.checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
      let v2 = this.checkVisibility([0, 1], A2, blocks, SHADOWS);
      return (v1 + v2) / 2;
    }

    /* index1: first shadow >= A1 */
    let index1 = 0,
      edge1 = false;
    while (index1 < SHADOWS.length) {
      let old = SHADOWS[index1];
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
    let index2 = SHADOWS.length,
      edge2 = false;
    while (index2--) {
      let old = SHADOWS[index2];
      let diff = A2[0] * old[1] - old[0] * A2[1];
      if (diff >= 0) {
        /* old <= A2 */
        if (diff == 0 && index2 % 2) {
          edge2 = true;
        }
        break;
      }
    }

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

    if (!visible) {
      return 0;
    } /* fast case: not visible */

    let visibleLength;

    /* compute the length of visible arc, adjust list of shadows (if blocking) */
    let remove = index2 - index1 + 1;
    if (remove % 2) {
      if (index1 % 2) {
        /* first edge within existing shadow, second outside */
        let P = SHADOWS[index1];
        visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove, A2);
        }
      } else {
        /* second edge within existing shadow, first outside */
        let P = SHADOWS[index2];
        visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove, A1);
        }
      }
    } else {
      if (index1 % 2) {
        /* both edges within existing shadows */
        let P1 = SHADOWS[index1];
        let P2 = SHADOWS[index2];
        visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove);
        }
      } else {
        /* both edges outside existing shadows */
        if (blocks) {
          SHADOWS.splice(index1, remove, A1, A2);
        }
        return 1; /* whole arc visible! */
      }
    }

    let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);

    return visibleLength / arcLength;
  }
  // private checkVisibility(
  //   A1: RationalNum,
  //   A2: RationalNum,
  //   blocks: boolean,
  //   shadows: RationalNum[]
  // ): number {
  //   // Case where we shifted
  //   if (A1[0] > A2[0]) {
  //     // Split into two subarcs, return average lighting
  //     let v1 = this.checkVisibility(A1, [A1[1], A1[1]], blocks, shadows);
  //     let v2 = this.checkVisibility([0, 1], A2, blocks, shadows);
  //     return (v1 + v2) / 2;
  //   }

  //   // Climb up the shadows index until we find one that we're greater than
  //   // Anywhere we compare index % 2, we're seeing if it's the final angle in an arc
  //   let index1 = 0;
  //   let edge1 = false;
  //   while (index1 < shadows.length) {
  //     const old = shadows[index1];
  //     const diff = diffRationalNums(old, A1);
  //     if (diff >= 0) {
  //       if (diff === 0 && !(index1 % 2)) {
  //         edge1 = true;
  //       }
  //       break;
  //     }
  //     index1++;
  //   }

  //   let index2 = shadows.length;
  //   let edge2 = false;
  //   while (index2--) {
  //     const old = shadows[index2];
  //     const diff = diffRationalNums(A2, old);
  //     if (diff >= 0) {
  //       if (diff == 0 && index2 % 2) {
  //         edge2 = true;
  //       }
  //       break;
  //     }
  //   }

  //   let visible = true;
  //   if (index1 == index2 && (edge1 || edge2)) {
  //     // subset of existing shadow, one of the edged matches
  //     visible = false;
  //   } else if (edge1 && edge2 && index1 + 1 === index2 && index2 % 2) {
  //     // Completely equivalent
  //     visible = false;
  //   } else if (index1 > index2 && index1 % 2) {
  //     // Subset of existing shadow, not touching
  //     visible = false;
  //   }

  //   // Fast case, not visible
  //   if (visible === false) {
  //     return 0;
  //   }

  //   let visibleLength = 0;
  //   // Get the number of items to remove
  //   let remove = index2 - index1 + 1;

  //   if (remove % 2) {
  //     // Only one edge exists in the shadows
  //     if (index1 % 2) {
  //       // First edge exists in the shadows
  //       let P = shadows[index1];
  //       visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
  //       if (blocks) {
  //         shadows.splice(index1, remove, A2);
  //       } else {
  //         // Only second edge exists in shadows
  //         let P = shadows[index2];
  //         visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
  //         if (blocks) {
  //           shadows.splice(index1, remove, A1);
  //         }
  //       }
  //     }
  //   } else {
  //     if (index1 % 2) {
  //       /* both edges within existing shadows */
  //       let P1 = shadows[index1];
  //       let P2 = shadows[index2];
  //       visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
  //       if (blocks) {
  //         shadows.splice(index1, remove);
  //       }
  //     } else {
  //       /* both edges outside existing shadows */
  //       if (blocks) {
  //         shadows.splice(index1, remove, A1, A2);
  //       }
  //       return 1; /* whole arc visible! */
  //     }
  //   }

  //   let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
  //   return visibleLength / arcLength;
  // }
}
