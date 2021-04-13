import { getRing4 } from "../fov/get-ring";
import { Vector2, PriorityQueue } from "../util";

/** A Vector2 that includes a range from an origin point */
interface RangeVector {
  /** The x coordinate */
  x: number;
  /** The y coordinate */
  y: number;
  /** The range */
  r: number;
}

interface DistanceFunction {
  (from: Vector2, to: Vector2): number;
}

/** Used to find a range from a central point, like movement or ranged attacks in turn-based games. */
export class RangeFinder {
  private getDistance: DistanceFunction = () => 1;
  readonly topology: "four" | "eight";

  /**
   * @param config - Configuration for the RangeFinder
   * @param config.topology - four | eight
   * @param config.getDistance - Override the distance function for terrain costs or blocked spaces.
   */
  constructor(config: {
    getDistance?: DistanceFunction;
    topology: "four" | "eight";
  }) {
    this.topology = config.topology;
    if (config.getDistance) {
      this.getDistance = config.getDistance;
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
   * @param config.start - Vector2 - The starting position
   * @param config.maxRange - The maximum range allowed
   * @param config.minRange - The minimum range allowed (optional)
   * @returns - RangeVector[] ({x,y,r}[])
   */
  findRange(config: {
    start: Vector2;
    maxRange: number;
    minRange?: number;
  }): RangeVector[] {
    const { start, maxRange: range, minRange = 0 } = config;

    // Nodes we will process neighbors of
    const horizon = new PriorityQueue<RangeVector>((v) => v.r);
    horizon.insert({ ...start, r: 0 });

    const explored = new Map<string, number>();
    explored.set(`${start.x}:${start.y}`, 0);

    const breadcrumbs = new Map<string, string>();

    while (horizon.size()) {
      // Handle current node first
      const current = horizon.pop()!;

      // Handle neighbors
      const neighbors = this.getNeighbors(current);
      for (let n of neighbors) {
        const distance = current.r + this.getDistance(current, n);
        const neighbor = { ...n, r: distance };

        // See if it's even in range
        if (neighbor.r > range) continue;

        // If we've not seen it before, just add it and reprocess neighbors
        if (!explored.has(`${neighbor.x}:${neighbor.y}`)) {
          explored.set(`${neighbor.x}:${neighbor.y}`, neighbor.r);
        } else {
          // Otherwise check if it's a shorter path, ignore if not
          const existingDistance = explored.get(`${neighbor.x}:${neighbor.y}`)!;
          if (neighbor.r < existingDistance) {
            explored.set(`${neighbor.x}:${neighbor.y}`, neighbor.r);
            breadcrumbs.set(
              `${neighbor.x}:${neighbor.y}`,
              `${current.x}:${current.y}`
            );
          }
        }

        // Either way, add it to the horizon for its neighbors to be processed.
        horizon.insert(neighbor);
      }
    }

    // Return everything in range
    const result: RangeVector[] = [];
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
