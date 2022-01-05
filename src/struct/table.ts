import { Vector2 } from "./vector";

export class Table<T> {
  items: T[] = [];
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    // ToDo - Initialize empty array
  }

  fill(value: T) {
    const size = this.width * this.height;
    for (let i = 0; i < size; i++) {
      this.items[i] = value;
    }
  }

  get({ x, y }: Vector2): T | undefined {
    if (!this.isInBounds({ x, y })) return undefined;
    const index = y * this.width + x;
    return this.items[index];
  }

  set(pos: Vector2, item: T | undefined): void {
    if (this.isInBounds(pos) === false)
      throw new Error(`${pos.x + ":" + pos.y} is not in bounds`);
    const index = pos.y * this.width + pos.x;
    if (item !== undefined) this.items[index] = item;
    else delete this.items[index];
  }

  clear(pos: Vector2) {
    const index = pos.y * this.width + pos.x;
    delete this.items[index];
  }

  isInBounds({ x, y }: Vector2) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    } else {
      return true;
    }
  }

  getNeighbors(
    pos: Vector2,
    predicate?: (pos: Vector2, t: T | undefined) => Boolean,
    topology: "four" | "eight" = "eight"
  ): Vector2[] {
    let neighbors: Vector2[] = [];

    neighbors.push({ x: pos.x + 1, y: pos.y });
    neighbors.push({ x: pos.x, y: pos.y + -1 });
    neighbors.push({ x: pos.x + -1, y: pos.y });
    neighbors.push({ x: pos.x, y: pos.y + 1 });

    if (topology === "eight") {
      neighbors.push({ x: pos.x + 1, y: pos.y - 1 });
      neighbors.push({ x: pos.x + -1, y: pos.y + -1 });
      neighbors.push({ x: pos.x + -1, y: pos.y + 1 });
      neighbors.push({ x: pos.x + 1, y: pos.y + 1 });
    }

    neighbors = neighbors.filter((v) => this.isInBounds(v));

    if (predicate) {
      neighbors = neighbors.filter((v) => predicate(v, this.get(v)));
    }

    return neighbors;
  }

  floodFillSelect(pos: Vector2, targetValue?: T | undefined): Vector2[] {
    if (!targetValue) {
      targetValue = this.get(pos);
    }

    // If given a target value, must match start position
    if (this.get(pos) !== targetValue) {
      return [];
    }

    const horizon = [pos];
    // "x:y", for quick indexing
    const floodFill = new Set<String>();

    while (horizon.length) {
      const point = horizon.shift()!;
      const value = this.get(point);

      // If not the right type of value, we're done.
      if (value !== targetValue) continue;
      // If we've already marked this spot
      if (floodFill.has(`${point.x}:${point.y}`)) continue;

      // If it is the proper value, collect it
      floodFill.add(`${point.x}:${point.y}`);

      // The add it's neighbors to the search horizon
      const neighbors = this.getNeighbors(point, undefined, "four");
      horizon.push(...neighbors);
    }

    const fill = Array.from(floodFill.keys()).map((str) => {
      const [x, y] = str.split(":");
      return {
        x: Number.parseInt(x),
        y: Number.parseInt(y),
      };
    });

    return fill;
  }

  filter(match: (v: Vector2, val: T | undefined) => boolean): Vector2[] {
    const matches: Vector2[] = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (match({ x, y }, this.get({ x, y }))) {
          matches.push({ x, y });
        }
      }
    }

    return matches;
  }

  clone(): Table<T> {
    const t = new Table<T>(this.width, this.height);
    t.items = this.items.slice();
    return t;
  }

  isSameSize(other: Table<T>): boolean {
    return this.width === other.width && this.height === other.height;
  }
}
