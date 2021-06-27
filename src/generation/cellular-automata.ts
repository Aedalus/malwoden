import { Table } from "../util";
import { IRNG, AleaRNG } from "../rand";
import { connect, ConnectData } from "./util";

interface CellularAutomataOptions<T> {
  aliveValue: T;
  deadValue: T;
  rng: IRNG;
}

/** Used to create CellularAutomata Maps. */
export class CellularAutomata<T> {
  table: Table<T>;

  readonly aliveValue: T;
  readonly deadValue: T;

  private rng: IRNG;

  /**
   * Creates a Cellular Automata Map Generator
   *
   * @param width The width of the map.
   * @param height The height of the map.
   * @param options Additional options.
   */
  constructor(
    width: number,
    height: number,
    options: Partial<CellularAutomataOptions<T>> = {}
  ) {
    this.table = new Table<T>(width, height);

    // Set up defaults
    this.aliveValue =
      options.aliveValue === undefined ? (1 as any) : options.aliveValue;
    this.deadValue =
      options.deadValue === undefined ? (0 as any) : options.deadValue;
    this.rng = options.rng === undefined ? new AleaRNG() : options.rng;
  }

  /**
   * Randomly sets each cell to either alive or dead.
   *
   * @param isAliveChance The chance for a cell to be set to the 'alive' value.
   */
  randomize(isAliveChance = 0.6) {
    for (let x = 0; x < this.table.width; x++) {
      for (let y = 0; y < this.table.height; y++) {
        const isAlive = this.rng.next() > isAliveChance;
        if (isAlive) {
          this.table.set({ x, y }, this.aliveValue);
        } else {
          this.table.set({ x, y }, this.deadValue);
        }
      }
    }
  }

  private countAliveNeighbors(x: number, y: number): number {
    let count = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let neighbor_x = x + i;
        let neighbor_y = y + j;
        if (i == 0 && j == 0) {
          //this code is supposed to do nothing as it is the focal point we're checking around.
        } else if (
          this.table.isInBounds({ x: neighbor_x, y: neighbor_y }) == false
        ) {
          count++;
        } else if (
          this.table.get({ x: neighbor_x, y: neighbor_y }) == this.aliveValue
        ) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Runs a number of simulation steps.
   * Each step generally "smooths" the map.
   *
   * @param stepCount The number of steps to run.
   */
  doSimulationStep(stepCount = 1) {
    for (let step = 0; step < stepCount; step++) {
      const newMap = new Table<T>(this.table.width, this.table.height);
      const oldMap = this.table; //this just renames the table to prevent 'this' all over the place.
      for (let x = 0; x < oldMap.width; x++) {
        for (let y = 0; y < oldMap.height; y++) {
          let nbs = this.countAliveNeighbors(x, y);
          if (oldMap.get({ x, y }) === this.aliveValue) {
            if (nbs < 4) {
              newMap.set({ x, y }, this.deadValue);
            } else {
              newMap.set({ x, y }, this.aliveValue);
            }
          } else {
            if (nbs > 3) {
              newMap.set({ x, y }, this.aliveValue);
            } else {
              newMap.set({ x, y }, this.deadValue);
            }
          }
        }
      }
      this.table = newMap;
    }
  }

  /**
   * Connects areas of the map to ensure they are all connected.
   *
   * For instance, if you're using an alive value of 1 for walls,
   * then this can connect the dead value of 0 to ensure all
   * squares on the map are accessable.
   *
   * @param value The value to connect (default this.deadValue)
   */
  connect(value = this.deadValue): ConnectData {
    return connect(this.table, value);
  }
}
