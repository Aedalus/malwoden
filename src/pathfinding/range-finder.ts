import { getRing4 } from "../fov/get-ring";
import { Vector2, HeapPriorityQueue } from "../struct";
import { TerrainCallback, RangeVector2 } from "./pathfinding-common";

/**
 * Used to find a range from a central point, like movement or ranged attacks in
 * turn-based games. This uses a search similar to Dijkstra or AStar, but returns
 * a list of tiles in range of a starting point, rather than a path to a goal.
 */
export class RangeFinder {
  private getTerrain: TerrainCallback = () => 1;
  readonly topology: "four" | "eight";

  /**
   * @param config - Configuration for the RangeFinder
   * @param config.topology - four | eight
   * @param config.getTerrainCallback - Override the distance function for terrain costs or blocked spaces.
   */
  constructor(config: {
    getTerrainCallback?: TerrainCallback;
    topology: "four" | "eight";
  }) {
    this.topology = config.topology;
    if (config.getTerrainCallback) {
      this.getTerrain = config.getTerrainCallback;
    }
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

  /**
   * Find the range from a given point.
   * @param config - Configuration for the findRange
   * @param config.start - Vector2 - The starting point
   * @param config.maxRange - The maximum range allowed
   * @param config.minRange - The minimum range allowed (optional)
   * @returns - RangeVector2[] ({x,y,r}[])
   */
  compute(config: {
    start: Vector2;
    maxRange: number;
    minRange?: number;
  }): RangeVector2[] {
    const { start, maxRange: range, minRange = 0 } = config;

    // Nodes we will process neighbors of
    const horizon = new HeapPriorityQueue<RangeVector2>((v) => v.r);
    horizon.insert({ ...start, r: 0 });

    const explored = new Map<string, number>();
    explored.set(`${start.x}:${start.y}`, 0);

    while (horizon.size()) {
      // Handle current node first
      const current = horizon.pop()!;

      // Handle neighbors
      const neighbors = this.getNeighbors(current);
      for (let n of neighbors) {
        const distance = current.r + this.getTerrain(current, n);
        const neighbor = { ...n, r: distance };

        // See if it's even in range
        if (neighbor.r > range) continue;

        // We pay attention only if we haven't seen it before,
        // or we just found a shorter path
        const importantNeighbor =
          !explored.has(`${neighbor.x}:${neighbor.y}`) ||
          neighbor.r < explored.get(`${neighbor.x}:${neighbor.y}`)!;

        if (importantNeighbor) {
          explored.set(`${neighbor.x}:${neighbor.y}`, neighbor.r);
          horizon.insert(neighbor);
        }
      }
    }

    // Return everything in range
    const result: RangeVector2[] = [];
    explored.forEach((distance, vs) => {
      // Return if not in the right range
      if (distance < minRange || distance > range) return;

      const [x, y] = vs.split(":");
      result.push({
        x: Number.parseInt(x),
        y: Number.parseInt(y),
        r: distance,
      });
    });
    return result;
  }
}
