import { Vector2, ArrayPriorityQueue } from "../util";
import * as Calc from "../calc";
import { getRing4 } from "../fov/get-ring";
import {
  DistanceCallback,
  IsBlockedCallback,
  RangeVector2,
} from "./pathfinding-common";

interface DijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
  getDistanceCallback?: DistanceCallback;
  topology: "four" | "eight";
}

export class Dijkstra {
  readonly topology: "four" | "eight";
  private readonly _isBlocked?: IsBlockedCallback;
  private readonly _getDistance: DistanceCallback = () => 1;

  constructor(config: DijkstraConfig) {
    this.topology = config.topology;
    if (config.getDistanceCallback) {
      this._getDistance = config.getDistanceCallback;
    }
    if (config.isBlockedCallback) {
      this._isBlocked = config.isBlockedCallback;
    }
  }

  private getDistance(from: Vector2, to: Vector2): number {
    if (this._isBlocked && this._isBlocked(to)) return Infinity;
    return this._getDistance(from, to);
  }

  private getNeighbors(pos: Vector2): Vector2[] {
    const neighbors = getRing4(pos.x, pos.y, 1);

    if (this.topology === "eight") {
      neighbors.push({ x: pos.x + 1, y: pos.y - 1 });
      neighbors.push({ x: pos.x - 1, y: pos.y - 1 });
      neighbors.push({ x: pos.x - 1, y: pos.y + 1 });
      neighbors.push({ x: pos.x + 1, y: pos.y + 1 });
    }

    return neighbors;
  }

  private computePathBack(
    current: RangeVector2,
    cameFrom: Map<string, string>,
    visited: Map<string, number>
  ): RangeVector2[] {
    let curStr = `${current.x}:${current.y}`;
    const totalPath: RangeVector2[] = [current];

    while (cameFrom.get(curStr)) {
      const prevStr = cameFrom.get(curStr)!;
      const [x, y] = prevStr.split(":");
      const r = visited.get(prevStr)!;
      curStr = prevStr;
      totalPath.unshift({
        x: Number.parseInt(x),
        y: Number.parseInt(y),
        r,
      });
    }
    console.log({ cameFrom, visited });
    return totalPath;
  }

  compute(start: Vector2, end: Vector2): Vector2[] | undefined {
    const breadcrumbs = new Map<string, string>();
    const visited = new Map<string, number>();

    // Horizon are tiles we've visited, but still need to check neighbors
    const horizon = new ArrayPriorityQueue<RangeVector2>((v) => v.r);

    // Initialize
    visited.set(`${start.x}:${start.y}`, 0);
    horizon.insert({ ...start, r: 0 });

    while (horizon.size()) {
      //shift the last node off the array.
      const current = horizon.pop()!;

      // check to see if the space is where you need to be. If so, exit loop.
      if (Calc.Vector.areEqual(current, end)) {
        return this.computePathBack(current, breadcrumbs, visited);
      }

      for (let n of this.getNeighbors(current)) {
        const stepDistance = this.getDistance(current, n);
        const totalDistance = current.r + stepDistance;
        if (stepDistance === Infinity) continue;

        // Only interesting if we haven't been there, or if we found a shorter path.
        const interestingNeighbor =
          !visited.has(`${n.x}:${n.y}`) ||
          totalDistance < visited.get(`${n.x}:${n.y}`)!;

        if (interestingNeighbor) {
          horizon.insert({
            ...n,
            r: current.r + stepDistance,
          });
          visited.set(`${n.x}:${n.y}`, totalDistance);
          breadcrumbs.set(`${n.x}:${n.y}`, `${current.x}:${current.y}`);
        }
      }
    }
    return undefined;
  }
}
