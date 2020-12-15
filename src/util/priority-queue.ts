// ToDo - Make this more efficient via heap
export class PriorityQueue<T> {
  private data: [number, T][] = [];
  private priorityFunc: (t: T) => number;

  constructor(priorityFunc: (t: T) => number) {
    this.priorityFunc = priorityFunc;
  }

  insert(data: T) {
    const score = this.priorityFunc(data);
    this.data.push([score, data]);
  }

  peek(): T | undefined {
    if (this.data.length === 0) return undefined;

    let min = Infinity;
    let minIndex = -1;
    this.data.forEach(([val, d], index) => {
      if (val < min) {
        min = val;
        minIndex = index;
      }
    });

    return this.data[minIndex][1];
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;

    let min = Infinity;
    let minIndex = -1;
    this.data.forEach(([val, d], index) => {
      if (val < min) {
        min = val;
        minIndex = index;
      }
    });

    const popped = this.data.splice(minIndex, 1);
    return popped[0][1];
  }

  size(): number {
    return this.data.length;
  }
}
