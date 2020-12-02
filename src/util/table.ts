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

  get(x: number, y: number): T | undefined {
    const index = y * this.width + x;
    return this.items[index];
  }

  set(x: number, y: number, item: T | undefined): void {
    const index = y * this.width + x;
    if (item) this.items[index] = item;
    else delete this.items[index];
  }

  isInBounds(x: number, y: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    } else {
      return true;
    }
  }
}
