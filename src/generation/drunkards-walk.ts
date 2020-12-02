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
  walk(x: number, y: number) {
    const newMap = new Table<T>(this.table.width, this.table.height);
    console.log("we are walking", x, y);
    const ronNum = Math.floor(Math.random() * Math.floor(4));
    newMap.set(20, 20, this.CurrentPosition);
    newMap.set(19, 20, this.Traversed);
    return newMap;
  }

  doSimulationStep(xInitial: number, yInitial: number, stepsToTake = 1) {
    const oldMap = this.table;
    oldMap.set(xInitial, yInitial, this.CurrentPosition);
    for (let step = 0; step < stepsToTake; step++) {
      //this just renames the table to prevent 'this' all over the place.

      for (let x = 0; x < oldMap.width; x++) {
        for (let y = 0; y < oldMap.height; y++) {
          if (oldMap.get(x, y) === this.CurrentPosition) {
            this.table = this.walk(x, y);
          } else {
            console.log("we could not find an initial position.");
          }
        }
      }
    }

    //wrap this in a for loop for the length of steps to take at the end.
  }
}
