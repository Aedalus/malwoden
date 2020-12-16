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

  addCustomPoint(Cords: Vector2, tableValue: any) {
    this.table.set(Cords, tableValue);
    this.path.push(Cords);
  }

  walkSteps(
    initial: Vector2,
    stepsToTake: number = 100,
    toCoverTileCount: number = Infinity
  ) {
    //constants
    this.table.fill(0);
    let coveredTileCount: number = 1; // local step count for the function.
    // initial set for the drunk's and path add for position.
    this.path.push(initial);

    while (
      this.path.length !== stepsToTake &&
      coveredTileCount !== toCoverTileCount
    ) {
      // initital function setup for current array position and table set.
      const currentPosition = this.path[this.path.length - 1];
      this.table.set(currentPosition, 1);

      const randomDirection = this.getRandomDirection();
      const nextPosition: Vector2 = {
        x: currentPosition.x + randomDirection.x,
        y: currentPosition.y + randomDirection.y,
      };
      //check if the space is within bounds.

      if (this.table.isInBounds(nextPosition) === false) {
        continue;
      }
      // check to see if you've already been there before. If not, increase covered tiled count. Otherwise, set the table and break the loop.
      if (this.table.get(nextPosition) === 0) {
        coveredTileCount = coveredTileCount + 1;
        this.coveredTiles = coveredTileCount;
      }
      // adds nextPosition to the Path array and writes to the table.
      this.addCustomPoint(nextPosition, 1);

      // loop keepers
      this.step = this.step + 1;
    }
  }
}
