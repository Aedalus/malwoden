/**
 * HeapPriorityQueue allows for push/pop based on an attribute
 * of the inserted objects. The heap based implementation
 * underneath has theoretic O(log(n)) insert time and O(c)
 * pop/peek time.
 *
 * The queue will return items with the lowest priority scores.
 * All scores being equal, it will return objects in the order
 * they were inserted.
 */
export class HeapPriorityQueue<T> {
  private heap: T[] = [];
  private priorityFunc: (t: T) => number;

  /**
   * @param priorityFunc - A function that takes the a value that
   * has previously been inserted, and returns a priority.
   *
   * A lower score is higher priority.
   *
   * Ex. (user) => user.age
   */
  constructor(priorityFunc: (t: T) => number) {
    this.priorityFunc = priorityFunc;
  }

  private getPriority(t: T): number {
    return this.priorityFunc(t);
  }

  private findParent(index: number) {
    if (index % 2) {
      return (index - 1) / 2;
    } else {
      return Math.ceil((index - 1) / 2);
    }
  }

  private getChildFunction(parentIdx: number) {
    let [left, right] = [2 * parentIdx + 1, 2 * parentIdx + 2];

    if (left >= this.heap.length - 1) {
      // cannot go out of bounds for the array.
      return Infinity;
    }

    if (
      this.getPriority(this.heap[left]) < this.getPriority(this.heap[right])
    ) {
      return left;
    } else {
      return right;
    }
  }

  private bubbleUpwards() {
    let currentNodeIdx = this.heap.length - 1;
    let currentNodeParentIdx = this.findParent(currentNodeIdx);
    const newNode = this.heap[currentNodeIdx];

    while (
      this.getPriority(newNode) <
      this.getPriority(this.heap[currentNodeParentIdx])
    ) {
      const parent = this.heap[currentNodeParentIdx];
      this.heap[currentNodeParentIdx] = newNode;
      this.heap[currentNodeIdx] = parent;
      currentNodeIdx = currentNodeParentIdx;
      currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
    }
  }

  private bubbleDownwards() {
    // Special case for smaller sizes
    if (this.size() < 3) {
      this.heap.sort((a, b) => this.getPriority(a) - this.getPriority(b));
      return;
    }

    let currentIdx = 0;
    let currentChildIdx: number = this.getChildFunction(currentIdx);

    while (
      this.getPriority(this.heap[currentIdx]) >
      this.getPriority(this.heap[currentChildIdx])
    ) {
      const futureIdx = currentChildIdx; // this will become the new parent node at the end.
      const currentNode = this.heap[currentIdx]; // grabs the node.
      const futureNode = this.heap[currentChildIdx]; // grabs the child node.
      this.heap[currentChildIdx] = currentNode; // swaps node
      this.heap[currentIdx] = futureNode; // swaps node
      currentIdx = futureIdx; // sets the current node from the child
      currentChildIdx = this.getChildFunction(currentIdx); // gets children.
      if (currentChildIdx === Infinity) {
        break;
      }
    }
  }

  /**
   * Insert data into the queue
   * @param data - The data to insert
   */
  insert(data: T) {
    this.heap.push(data);
    this.bubbleUpwards();
  }

  /**
   * Get the item with the lowest priority score
   * @returns - The lowest priority item
   */
  pop() {
    const toRemove = this.heap.shift();
    this.bubbleDownwards();
    return toRemove;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
