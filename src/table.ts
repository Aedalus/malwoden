export class Table<T> {
  items: T[] = [];
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get(x: number, y: number): T | undefined {
    const index = y * this.width + x;
    return this.items[index];
  }

  set(x: number, y: number, item: T | undefined): void {
    const index = y * this.width + x;
    delete this.items[index];
  }
}
