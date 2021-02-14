import { Vector2, PriorityQueue } from "../util";
import * as Math from "../math";
import { getRing4 } from "../fov/get-ring";

interface dijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
  topology: "four" | "eight";
}

type IsBlockedCallback = (v: Vector2) => boolean;

export class Dijkstra {
  readonly topology: "four" | "eight";
  private readonly isBlocked?: IsBlockedCallback;

  constructor(config: dijkstraConfig) {
    this.isBlocked = config.isBlockedCallback;
    this.topology = config.topology;
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
    current: Vector2,
    cameFrom: Map<string, string>
  ): Vector2[] {
    let curStr = `${current.x}:${current.y}`;
    const totalPath: Vector2[] = [current];

    while (cameFrom.get(curStr)) {
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

  compute(initial: Vector2, goal: Vector2): Vector2[] | undefined {
    const cameFrom = new Map<string, string>();
    const visited: Set<string> = new Set();
    const horizon = new PriorityQueue<[Vector2, number]>(([_, d]) => d);

    // Initialize
    horizon.insert([initial, 0]);
    cameFrom.set(`${initial.x}:${initial.y}`, "");

    while (horizon.size()) {
      //shift the last node off the array.
      const [current, distance] = horizon.pop()!;

      //short circut
      if (visited.has(`${current.x}:${current.y}`)) {
        continue;
      } else {
        visited.add(`${current.x}:${current.y}`);
      }

      // check to see if the space is where you need to be. If so, exit loop.
      if (Math.Vector.areEqual(current, goal)) {
        return this.computePathBack(current, cameFrom);
      }

      let neighbors = this.getNeighbors(current);

      if (this.isBlocked) {
        neighbors = neighbors.filter((v) => this.isBlocked!(v) === false);
      }

      for (let n of neighbors) {
        if (visited.has(`${n.x}:${n.y}`) === false) {
          horizon.insert([n, distance + 1]);
        }
        if (cameFrom.has(`${n.x}:${n.y}`) === false) {
          cameFrom.set(`${n.x}:${n.y}`, `${current!.x}:${current!.y}`);
        }
      }
    }
    return undefined;
  }
}
