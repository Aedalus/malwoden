import { Vector2 } from "../util";

interface dijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
}

type IsBlockedCallback = (v: Vector2) => boolean;

interface dijkstraNode {
  v: Vector2;
}

export class Dijkstra {
  private readonly isBlocked?: IsBlockedCallback;
  constructor(config: dijkstraConfig) {
    this.isBlocked = config.isBlockedCallback;
  }
  compute(initial: Vector2, goal: Vector2): Vector2[] | undefined {
    //unpackage config.
    const cameFrom = new Map<string, string>();
    let processing = [initial];
    console.log("the log is: ", processing);
    console.log("the log is: ", processing.length);

    while (processing.length !== 0) {
      //shift the last node off the array.
      const current = processing.shift();
      console.log("the current processing element is: ", current);
      // check to see if the space is where you need to be. If so, exit loop.
      if (current === goal) {
        break;
      }
      //look at the adjacent spots.
      //check adjactent spots to see if they are either blocked or don't exist.

      // push in the four corners into processing if available on the table.

      //return an array of vector2s that corrospond to the path.
    }

    return undefined;
  }
}
