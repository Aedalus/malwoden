import { Table } from "../util";

export class DrunkardsWalk<T> {
  table: Table<T>;
  CurrentPosition: T;
  Traversed: T;
  Steps: number;

  constructor(width: number, height: number, CurrentPosition: T, Traversed: T, Steps: number) {
    this.table = new Table(width, height);
    this.CurrentPosition = CurrentPosition;
    this.Traversed = Traversed;
    this.Steps = Steps;
  }

  doSimulationStep(xInitial: number, yInitial: number, stepsToTake = 1) {
    const newMap = new Table<T>(this.table.width, this.table.height);
    this.table.set(xInitial, yInitial, this.CurrentPosition);
    for (let step = 0; step < stepsToTake; step++) {
      const oldMap = this.table;
      for (let x = 0; x < oldMap.width; x++) {
        for (let y = 0; y < oldMap.height; y++) {
          if (oldMap.get(x, y) === this.CurrentPosition) {
            const ranNum = Math.floor(Math.random() * 3);
            console.log(ranNum);
            // 0 = north
            // 1 = south
            // 2 = west
            // 3 = east
            switch (ranNum) {
              case 0:
                newMap.set(x, y - 1, this.CurrentPosition);
                newMap.set(x, y, this.Traversed);
                break;
              case 1:
                newMap.set(x, y + 1, this.CurrentPosition);
                newMap.set(x, y, this.Traversed);
                break;
              case 2:
                newMap.set(x + 1, y, this.CurrentPosition);
                newMap.set(x, y, this.Traversed);
                break;
              case 3:
                newMap.set(x - 1, y, this.CurrentPosition);
                newMap.set(x, y, this.Traversed);
                break;
            }
            console.log("ended switch.");
          }
        }
        this.table = newMap;
      }

      //wrap this in a for loop for the length of steps to take at the end.
    }
  }
}
