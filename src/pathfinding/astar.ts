import { getRing4 } from "../fov/get-ring";
import * as Calc from "../calc";
import { Vector2, ArrayPriorityQueue } from "../struct";
import {
  TerrainCallback,
  IsBlockedCallback,
  RangeVector2,
} from "./pathfinding-common";

interface AStarConfig {
  isBlockedCallback?: IsBlockedCallback;
  getTerrainCallback?: TerrainCallback;
  topology: "four" | "eight";
}

/**
 * AStar is a path finding algorithm that attempts search tiles closer
 * the goal. It estimates a tiles score as the known distance to that
 * tile, plus the distance to goal as the bird flies. It will always
 * first evaluate the tile it knows to currently have the score,
 * and continue from there.
 */
export class AStar {
  readonly topology: "four" | "eight";
  private readonly _isBlocked?: IsBlockedCallback;
  private readonly _getTerrainCallback: TerrainCallback = () => 1;

  /**
   * @param config - General parameters for the AStar Pathfinder
   * @param config.isBlockedCallback - Return true if the position is blocked.
   * @param config.getTerrainCallback - Provide terrain costs for movement (optional)
   * @param config.topology - four | eight
   */
  constructor(config: AStarConfig) {
    this._isBlocked = config.isBlockedCallback;
    this.topology = config.topology;
    if (config.getTerrainCallback) {
      this._getTerrainCallback = config.getTerrainCallback;
    }
  }

  private getDistance(from: Vector2, to: Vector2): number {
    if (this._isBlocked && this._isBlocked(to)) return Infinity;
    return this._getTerrainCallback(from, to);
  }

  /**
   * Get all neightbors of a point. Returns orthogonal
   * directions first, then diagonal if topology is 8.
   * Results in more natural looking paths.
   * @param pos - Vector2
   */
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
    // visited tracks the cheapest known distance to a spot
    // estimate tracks visited score + heuristic
    const visited = new Map<string, number>();
    visited.set(`${start.x}:${start.y}`, 0);

    // Nodes where we still need to check neighbors, prioritized by fscore
    // The RangeVector here will be partly redundant with the value
    // tracked by visited
    const horizon = new ArrayPriorityQueue<[RangeVector2, number]>(
      ([_, fscore]) => fscore
    );
    horizon.insert([
      { ...start, r: 0 },
      Calc.Vector.getDistance(start, end, "eight"),
    ]);

    // Find our way home
    const breadcrumbs = new Map<string, string>();

    while (horizon.size()) {
      const [current, _] = horizon.pop()!;

      // If we're at the end, find our path and return
      if (Calc.Vector.areEqual(current, end)) {
        return this.computePathBack(current, breadcrumbs, visited);
      }

      for (let n of this.getNeighbors(current)) {
        const nr = current.r + this.getDistance(current, n);

        // If neighbor range is infinity, we can't get there
        if (nr === Infinity) continue;

        const interestingNeighbor =
          !visited.has(`${n.x}:${n.y}`) || nr < visited.get(`${n.x}:${n.y}`)!;

        if (interestingNeighbor) {
          breadcrumbs.set(`${n.x}:${n.y}`, `${current.x}:${current.y}`);
          visited.set(`${n.x}:${n.y}`, nr);
          const estimate = nr + Calc.Vector.getDistance(n, end, "eight");
          horizon.insert([{ ...n, r: nr }, estimate]);
        }
      }
    }

    // We never got current == end
    return undefined;
  }
}
