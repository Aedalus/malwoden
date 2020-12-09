import { Table, Vector2 } from "../util";

export class DrunkardsWalk {
  table: Table<number>;
  coveredTiles: number = 0;
  path: Vector2[] = [];
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

  private addStep(historicalRecord: any, xCord: number, yCord: number) {
    //check to see if the requested cordinates are unique within historicalRecord. If unique, return true. If not unique return false.
    const result = historicalRecord.filter(
      (record: any) => record.xCord === xCord && yCord === record.yCord
    );
    if (result.length <= 1) {
      return true;
    } else {
      return false;
    }
  } // this needs to be moved to the table check. If the table has a value, you've either been there are or are there.

  //private get randDirection(){} return type of vector2. Concept 'cycolmatic complexity'.

  RunSimulationOnSteps(
    xInitial: number,
    yInitial: number,
    stepsToTake = 1,
    toCoverTileCount: number = Infinity
  ) {
    //constants
    this.table.fill(0);
    let check: boolean;
    let coveredTileCount: number = 1;
    //initial set for the drunk's position.
    this.table.set(xInitial, yInitial, 2);
    this.path.push({ x: xInitial, y: yInitial });

    stepLoop: for (let step = 0; step < stepsToTake; step++) {
      if (coveredTileCount === toCoverTileCount) {
        break stepLoop;
      }
      const currentPosition = this.path[this.path.length - 1];
      const randomDirection = this.getRandomDirection();
      const nextPosition = {
        x: currentPosition.x + randomDirection.x,
        y: currentPosition.y + randomDirection.y,
      };
      //check if the space is within bounds.
      //check to see if you've already been there before. If not, increase covered tiled count.

      //check to see if this space has been occupied before.
    }
    //sets x and y to an absurd number so the forloop ends it doesn't get picked a easterly or southerly movement.
  }
}

//means of improvement

// fill in a hundred blocks, rather than just taking 100 steps.
// take n number of steps --- can do
// show where the drunk has been, each step of the way.
//
