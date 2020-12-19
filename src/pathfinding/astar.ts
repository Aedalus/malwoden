import { getRing4, getRing8 } from "../fov/get-ring";
import { IRNG } from "../rand";
import { Vector2, getDistance, PriorityQueue, areEqual } from "../util";

interface AStarConfig {
  isBlockedCallback?: IsBlockedCallback;
  topology: "four" | "eight";
  randomizeNeighbors?: boolean;
  rng?: IRNG;
}

type IsBlockedCallback = (v: Vector2) => boolean;

interface AStarNode {
  v: Vector2;
  fScore: number;
}

export class AStar {
  readonly topology: "four" | "eight";
  private readonly callback?: IsBlockedCallback;
  private readonly randomizeNeighbors: boolean;

  /**
   *
   * @param config - General parameters for the AStar Pathfinder
   * @param config.isBlockedCallback - Return true if the position is blocked.
   * @param config.topology - four | eight
   * @param config.randomizeNeighbors - Will randomly select a neighbor each step, resulting in paths that are more organic
   * @param config.rng - RNG to use. Default is a new Alea RNG
   */
  constructor(config: AStarConfig) {
    this.callback = config.isBlockedCallback;
    this.topology = config.topology;
    this.randomizeNeighbors =
      config.randomizeNeighbors === undefined ? true : false;
  }

  compute(start: Vector2, end: Vector2): Vector2[] | undefined {
    // openSet is the set of discovered nodes, and more might be found
    const openSet = new PriorityQueue<AStarNode>((n) => n.fScore);
    openSet.insert({
      v: start,
      fScore: getDistance(start, end, this.topology),
    });

    // cameFrom maps a node to the one preceding it with the cheapest path
    const cameFrom = new Map<string, string>();

    // gScore tracks the cheapest path from start to the node
    // fScore tracks gScore + esimated
    const gScore = new Map<string, number>();
    gScore.set(`${start.x}:${start.y}`, 0);

    while (openSet.size) {
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

      const neighbors =
        this.topology === "four"
          ? getRing4(current.x, current.y, 1)
          : getRing8(current.x, current.y, 1);

      let currentGScore = gScore.has(`${current.x}:${current.y}`)
        ? gScore.get(`${current.x}:${current.y}`)!
        : Infinity;

      for (let n of neighbors) {
        // ToDo - Optimize this? Not sure if heuristic makes sense if we know the distance.
        // ToDo - llow the distance to be determined by function
        let tentative_gScore = currentGScore + 1;

        if (gScore.has(`${n.x}:${n.y}`) === false) {
          cameFrom.set(`${n.x}:${n.y}`, `${current.x}:${current.y}`);
          gScore.set(`${n.x}:${n.y}`, tentative_gScore);
          const fScore = tentative_gScore + getDistance(n, end, this.topology);
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
