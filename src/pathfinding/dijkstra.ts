import { Vector2, ArrayPriorityQueue } from "../util";
import * as Calc from "../calc";
import { getRing4 } from "../fov/get-ring";
import {
  TerrainCallback,
  IsBlockedCallback,
  RangeVector2,
} from "./pathfinding-common";

interface DijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
  getTerrainCallback?: TerrainCallback;
  topology: "four" | "eight";
}

/**
 * Dijkstra's algorithm is a breadth first search to find the goal.
 * This makes it slower than AStar in most cases, as it doesn't know
 * how to 'guess' if a tile is closer to the goal or not. However in
 * most cases the difference in speed is negligible, and this
 * version of Dijkstra's algorithm can occasionally result in more
 * 'normal' looking paths.
 */
export class Dijkstra {
  readonly topology: "four" | "eight";
  private readonly _isBlocked?: IsBlockedCallback;
  private readonly _getDistance: TerrainCallback = () => 1;

  /**
   * @param config - General parameters for the AStar Pathfinder
   * @param config.isBlockedCallback - Return true if the position is blocked.
   * @param config.getTerrainCallback - Provide terrain costs for movement (optional)
   * @param config.topology - four | eight
   */
  constructor(config: DijkstraConfig) {
    this.topology = config.topology;
    if (config.getTerrainCallback) {
      this._getDistance = config.getTerrainCallback;
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
    return totalPath;
  }

  /**
   * Computes a given path from a start and end point. If not path is found,
   * it will return undefined. Both the start + end points will be returned
   * in the path.
   *
   * @param start Vector2 - The starting point
   * @param end  Vector2 - The ending point
   *
   * @returns RangeVector2[] | undefined - Returns the path,
   * including start + end, or undefined if no path is found.
   */
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
