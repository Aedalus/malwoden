import { getRing4, getRing8 } from "../fov/get-ring";
import { Vector2, getDistance, PriorityQueue, areEqual } from "../util";

interface AStarConfig {
  isBlockedCallback?: IsBlockedCallback;
  topology: "four" | "eight";
}

type IsBlockedCallback = (v: Vector2) => boolean;

interface AStarNode {
  v: Vector2;
  fScore: number;
}

export class AStar {
  readonly topology: "four" | "eight";
  private readonly isBlocked?: IsBlockedCallback;

  /**
   * @param config - General parameters for the AStar Pathfinder
   * @param config.isBlockedCallback - Return true if the position is blocked.
   * @param config.topology - four | eight
   */
  constructor(config: AStarConfig) {
    this.isBlocked = config.isBlockedCallback;
    this.topology = config.topology;
  }

  /**
   * @param start Vector2 - The starting position
   * @param end  Vector2 - The ending position
   *
   * @returns Vector2[] | undefined - Returns the path,
   * including start + end, or undefined if no path is found.
   */
  compute(start: Vector2, end: Vector2): Vector2[] | undefined {
    // openSet is the set of discovered nodes, and more might be found
    const openSet = new PriorityQueue<AStarNode>((n) => n.fScore);
    openSet.insert({
      v: start,
      fScore: getDistance(start, end, "eight"),
    });

    // cameFrom maps a node to the one preceding it with the cheapest path
    const cameFrom = new Map<string, string>();

    // gScore tracks the cheapest path from start to the node
    // fScore tracks gScore + esimated
    const gScore = new Map<string, number>();
    gScore.set(`${start.x}:${start.y}`, 0);

    while (openSet.size()) {
      const { v: current } = openSet.pop()!;
      if (areEqual(current, end)) {
        let curStr = `${current.x}:${current.y}`;
        const totalPath: Vector2[] = [current];
        while (cameFrom.has(curStr)) {
          const prevStr = cameFrom.get(curStr)!;
          const [x, y] = prevStr.split(":");
          curStr = prevStr;
          totalPath.unshift({
            x: Number.parseInt(x),
            y: Number.parseInt(y),
          });
        }
        return totalPath;
      }

      let neighbors =
        this.topology === "four"
          ? getRing4(current.x, current.y, 1)
          : getRing8(current.x, current.y, 1);

      if (this.isBlocked) {
        neighbors = neighbors.filter((v) => this.isBlocked!(v) === false);
      }

      let currentGScore = gScore.has(`${current.x}:${current.y}`)
        ? gScore.get(`${current.x}:${current.y}`)!
        : Infinity;

      for (let n of neighbors) {
        // ToDo - allow the distance to be determined by function
        let tentative_gScore = currentGScore + 1;

        if (gScore.has(`${n.x}:${n.y}`) === false) {
          cameFrom.set(`${n.x}:${n.y}`, `${current.x}:${current.y}`);
          gScore.set(`${n.x}:${n.y}`, tentative_gScore);
          const fScore = tentative_gScore + getDistance(n, end, "eight");
          openSet.insert({
            v: n,
            fScore,
          });
        }
      }
    }

    // We never got current == end
    return undefined;
  }
}
