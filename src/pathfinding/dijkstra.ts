import { Vector2 } from "../util";
import * as Math from "../math";

interface dijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
}

type IsBlockedCallback = (v: Vector2) => boolean;

export class Dijkstra {
  private readonly isBlocked?: IsBlockedCallback;

  constructor(config: dijkstraConfig) {
    this.isBlocked = config.isBlockedCallback;
  }

  compute(initial: Vector2, goal: Vector2): Vector2[] | undefined {
    //unpackage config.
    const cameFrom = new Map<string, string>();
    let processed: string[] = [];
    let processing: Vector2[] = [];
    processing.push(initial);

    while (processing.length !== 0) {
      //shift the last node off the array.
      const current = processing.shift()!;
      // check to see if the space is where you need to be. If so, exit loop.
      if (Math.Vector.areEqual(current, goal)) {
        let curStr = `${current.x}:${current.y}`;
        const totalPath: Vector2[] = [current];

        while (cameFrom.has(curStr)) {
          //infinate loop here.
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

      //check adjactent spots to see if they are either blocked or don't exist.
      const neighbors = [
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
      ];

      //set up for prcessing the nieghbors to see if they've been checked before.
      let processedNeighbors = [];

      for (let n of neighbors) {
        const check = processed.includes(`${n.x}:${n.y}`);
        if (check === false) {
          processedNeighbors.push(n);
        }
      }

      for (let n of processedNeighbors) {
        //should check if it is in bounds?
        processing.push(n);
        cameFrom.set(`${n.x}:${n.y}`, `${current!.x}:${current!.y}`); //putting a space here makes the program work when it should break it. Why?
      }
      processed.push(`${current.x}:${current.y}`);
    }

    return undefined;
  }
}
