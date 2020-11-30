import { Table } from "../util";

export class DrunkardsWalk<T> {
  table: Table<T>;
  constructor(width: number, height: number) {
    this.table = new Table(width, height);
  }
}
