/**
 * ArrayPriorityQueue allows for push/pop based on an attribute
 * of the inserted objects. The array based implementation
 * underneath has theoretic O(c) insert time, and O(n)
 * peek/pop time.
 *
 * Though this is slower in many cases than the heap based implementation,
 * it preserves the order better and can result in more 'normal' paths
 * when used with pathfinding.
 */
export class ArrayPriorityQueue<T> {
  private data: [number, T][] = [];
  private priorityFunc: (t: T) => number;

  /**
   * @param priorityFunc - A function that takes the a value that
   * has previously been inserted, and returns a priority.
   *
   * A lower score is higher priority.
   *
   * Ex. (monster) => monster.speed
   */
  constructor(priorityFunc: (t: T) => number) {
    this.priorityFunc = priorityFunc;
  }

  /**
   * Insert data into the queue
   * @param data - The data to insert
   */
  insert(data: T) {
    const score = this.priorityFunc(data);
    this.data.push([score, data]);
  }

  /**
   * Get the item with the lowest priority score,
   * removing it from the queue.
   * @returns - The lowest priority item
   */
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

  /**
   * Get the item with the lowest priotity score,
   * WITHOUT removing it.
   * @returns - The lowest priority item
   */
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

  /**
   * Returns the number of items in the queue.
   * @returns - Number of items in the queue.
   */
  size(): number {
    return this.data.length;
  }
}
