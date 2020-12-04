import { Table } from "../util";
import { isNumber } from "util";

export class DrunkardsWalk {
  table: Table<number>;

  constructor(width: number, height: number) {
    this.table = new Table(width, height);
  }

  gethistoricalDataAtX() {
    //gets the requested historical data at x position.
  }

  getHistoricalData() {
    //gets the requested historical data.
  }

  private addStep(historicalRecord: any, xCord: number, yCord: number) {
    //check to see if the requested cordinates are unique within historicalRecord. If unique, return true. If not unique return false.
    const result = historicalRecord.filter(
      (record: any) => record.xCord === xCord && yCord === record.yCord
    );
    console.log(result);
    if (result.length <= 1) {
      console.log("we are recording true.");
      return true;
    } else {
      console.log("we are recording false.");
      return false;
    }
  }

  doSimulationStep(xInitial: number, yInitial: number, stepsToTake = 1) {
    //constants
    const Map = new Table<number>(this.table.width, this.table.height);
    const currentPosition = 2; //these numbers don't really matter. They need need to hold a num position.
    const Traversed = 1; //these numbers don't really matter. They need need to hold a num position.
    let coveredTileCount: number = 0;
    let historicalRecord = [];
    let check: boolean;
    //initial set for the drunk's position.
    Map.set(xInitial, yInitial, currentPosition);

    for (let step = 0; step < stepsToTake; step++) {
      console.log("step is ", step);
      loop1: for (let x = 0; x < Map.width; x++) {
        loop2: for (let y = 0; y < Map.height; y++) {
          if (Map.get(x, y) === currentPosition) {
            const ranNum = Math.floor(Math.random() * 4);
            // 0 = north ---  1 = south --- 2 = west --- 3 = east

            switch (ranNum) {
              case 0:
                Map.set(x, y - 1, currentPosition);
                Map.set(x, y, Traversed);
                historicalRecord.push({ xCord: x, yCord: y });
                //check to see if this space has been occupied before.
                check = this.addStep(historicalRecord, x, y);
                if (check === true) {
                  coveredTileCount = coveredTileCount + 1;
                }
                break;
              case 1:
                Map.set(x, y + 1, currentPosition);
                Map.set(x, y, Traversed);
                historicalRecord.push({ xCord: x, yCord: y });
                check = this.addStep(historicalRecord, x, y);
                if (check === true) {
                  coveredTileCount = coveredTileCount + 1;
                }
                //check to see if this space has been occupied before.
                break;
              case 2:
                Map.set(x + 1, y, currentPosition);
                Map.set(x, y, Traversed);
                historicalRecord.push({ xCord: x, yCord: y });
                check = this.addStep(historicalRecord, x, y);
                if (check === true) {
                  coveredTileCount = coveredTileCount + 1;
                }
                //check to see if this space has been occupied before.
                break;
              case 3:
                Map.set(x - 1, y, currentPosition);
                Map.set(x, y, Traversed);
                historicalRecord.push({ xCord: x, yCord: y });
                check = this.addStep(historicalRecord, x, y);
                if (check === true) {
                  coveredTileCount = coveredTileCount + 1;
                }
              //check to see if this space has been occupied before.
            }
            //sets x and y to an absurd number so the forloop ends it doesn't get picked a easterly or southerly movement.
            break loop1;
          }
        }
        this.table = Map;
      }
    }
  }
}

//means of improvement

// fill in a hundred blocks, rather than just taking 100 steps.
// take n number of steps --- can do
// show where the drunk has been, each step of the way.
//
