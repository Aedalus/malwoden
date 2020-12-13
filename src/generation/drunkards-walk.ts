import { Table, Vector2 } from "../util";

export class DrunkardsWalk {
  table: Table<number>;
  coveredTiles: number = 0;
  path: Vector2[] = [];
  step: number = 1;
  stepsToTake: number = 1;
  //fill the array with 0s.

  constructor(width: number, height: number) {
    this.table = new Table(width, height);
  }

  private getRandomDirection(): Vector2 {
    const ranNum = Math.floor(Math.random() * 4);
    // 0 = north ---  1 = south --- 2 = west --- 3 = east
    switch (ranNum) {
      case 0:
        return { x: 0, y: -1 };
      case 1:
        return { x: 0, y: 1 };
      case 2:
        return { x: -1, y: 0 };
      case 3:
        return { x: 1, y: 0 };
      default:
        throw new Error("Direction not recognized.");
    }
  }

  addStep(Path: any, xCord: number, yCord: number) {
    // To be done: allows user to insert a step into the table and record. It should also increase the step count if the user hasn't been there.
  }

  //private get randDirection(){} return type of vector2. Concept 'cycolmatic complexity'.

  RunSimulationOnSteps(
    xInitial: number,
    yInitial: number,
    stepsToTake: number = Infinity,
    toCoverTileCount: number = Infinity,
    xBounds: number = Infinity,
    yBounds: number = Infinity
  ) {
    //constants
    this.table.fill(0);
    let coveredTileCount: number = 1; // local step count for the function.
    let step: number = 0;
    // initial set for the drunk's and path add for position.
    this.table.set(xInitial, yInitial, 2);
    this.path.push({ x: xInitial, y: yInitial });

    stepLoop: while (step !== stepsToTake && coveredTileCount !== toCoverTileCount) {
      // initital function setup for current array position and table set.
      const currentPosition = this.path[this.path.length - 1];
      this.table.set(currentPosition.x, currentPosition.y, 1);

      const randomDirection = this.getRandomDirection();
      const nextPosition = {
        x: currentPosition.x + randomDirection.x,
        y: currentPosition.y + randomDirection.y,
      };
      //check if the space is within bounds.

      if (
        nextPosition.x < 0 ||
        nextPosition.y < 0 ||
        nextPosition.x >= xBounds ||
        nextPosition.y >= yBounds
      ) {
        continue stepLoop;
      }
      // adds nextPosition to the Path array.
      this.path.push(nextPosition);
      // check to see if you've already been there before. If not, increase covered tiled count. Otherwise, set the table and break the loop.
      if (this.table.get(nextPosition.x, nextPosition.y) === 0) {
        coveredTileCount = coveredTileCount + 1;
        this.coveredTiles = coveredTileCount;
      }
      // write to the table.
      this.table.set(nextPosition.x, nextPosition.y, 2);
      // loop keepers
      step = step + 1;
      this.step = step;
    }
  }
}
