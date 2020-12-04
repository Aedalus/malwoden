import { Table } from "../util";
import { RNG, AleaRNG } from "../rand";

interface CellularAutomataOptions<T> {
  aliveValue: T;
  deadValue: T;
  rng: RNG;
}

export class CellularAutomata<T> {
  table: Table<T>;

  readonly aliveValue: T;
  readonly deadValue: T;

  private rng: RNG;

  constructor(width: number, height: number, options: Partial<CellularAutomataOptions<T>> = {}) {
    this.table = new Table<T>(width, height);

    // Set up defaults
    this.aliveValue = options.aliveValue === undefined ? (1 as any) : options.aliveValue;
    this.deadValue = options.deadValue === undefined ? (0 as any) : options.deadValue;
    this.rng = options.rng === undefined ? new AleaRNG() : options.rng;
  }

  randomize(isAliveChance = 0.6) {
    for (let x = 0; x < this.table.width; x++) {
      for (let y = 0; y < this.table.height; y++) {
        const isAlive = this.rng.next() > isAliveChance;
        if (isAlive) {
          this.table.set(x, y, this.aliveValue);
        } else {
          this.table.set(x, y, this.deadValue);
        }
      }
    }
  }
  countAliveNeighbors(x: number, y: number): number {
    let count = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let neighbor_x = x + i;
        let neighbor_y = y + j;
        if (i == 0 && j == 0) {
          //this code is supposed to do nothing as it is the focal point we're checking around.
        } else if (this.table.isInBounds(neighbor_x, neighbor_y) == false) {
          count++;
        } else if (this.table.get(neighbor_x, neighbor_y) == this.aliveValue) {
          count++;
        }
      }
    }
    return count;
  }

  doSimulationStep(stepCount = 1) {
    for (let step = 0; step < stepCount; step++) {
      const newMap = new Table<T>(this.table.width, this.table.height);
      const oldMap = this.table; //this just renames the table to prevent 'this' all over the place.
      for (let x = 0; x < oldMap.width; x++) {
        for (let y = 0; y < oldMap.height; y++) {
          let nbs = this.countAliveNeighbors(x, y);
          if (oldMap.get(x, y) === this.aliveValue) {
            if (nbs < 4) {
              newMap.set(x, y, this.deadValue);
            } else {
              newMap.set(x, y, this.aliveValue);
            }
          } else {
            if (nbs > 3) {
              newMap.set(x, y, this.aliveValue);
            } else {
              newMap.set(x, y, this.deadValue);
            }
          }
        }
      }
      this.table = newMap;
    }
  }
}
