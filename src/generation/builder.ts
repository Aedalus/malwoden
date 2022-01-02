import { Table } from "../struct";

/**
 * Builder represents a base class used to create a new kind of map.
 * It is meant to be inherited from, with individual specialized builders
 * providing additional information as they generate the map. This basic Builder
 * class can still be used for it's snapshot functionality when playing with custom
 * map generation.
 *
 * A builder's type should generally be either a number or numeric enum.
 */
export class Builder<T> {
  protected map: Table<T>;

  protected snapshots: Table<T>[] = [];

  /**
   * Creates a new Builder
   * @param config.width - The map width
   * @param config.height - The map height
   */
  constructor(config: { width: number; height: number }) {
    this.map = new Table<T>(config.width, config.height);
  }

  /**
   * Returns the internal map.
   * @returns - Table<T>
   */
  getMap(): Table<T> {
    return this.map;
  }

  /**
   * Takes a snapshot of the current map state. These can
   * be retrieved through getSnapshots()
   */
  takeSnapshot(): void {
    this.snapshots.push(this.map.clone());
  }

  /**
   * Returns previously captured snapshots.
   * @returns - Table<T>[]
   */
  getSnapshots(): Table<T>[] {
    return this.snapshots;
  }

  /**
   * Clear previously captured snapshots.
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Sets the map values to match a given table. A shallow copy is made
   * from the given table.
   * @param table
   */
  copyFrom(table: Table<T>): void {
    if (this.map.isSameSize(table) === false) {
      throw new Error("Cannot copy between builders of different sizes");
    }
    this.map = table.clone();
  }
}
