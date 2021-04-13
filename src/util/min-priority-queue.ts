import { Vector2 } from "./vector";

class Node {
  value: Vector2;
  priority: number;
  constructor(val: Vector2, priority: number) {
    this.value = val;
    this.priority = priority;
  }
}

export class PriorityQueue<T> {
  private heap: any[] = []; //data followed by priority.

  private findParent(n: number) {
    if (n % 2) {
      return (n - 1) / 2;
    } else {
      return Math.ceil((n - 1) / 2);
    }
  }

  private getChildFunction(parentIdx: number) {
    let [left, right] = [2 * parentIdx + 1, 2 * parentIdx + 2];

    if (left >= this.heap.length - 1) {
      // cannot go out of bounds for the array.
      return Infinity;
    }

    if (this.heap[left].priority < this.heap[right].priority) {
      return left;
    } else {
      return right;
    }
  }

  private bubbleUpwards(newNode: Node) {
    let currentNodeIdx = this.heap.length - 1;
    let currentNodeParentIdx = this.findParent(currentNodeIdx);
    while (newNode.priority < this.heap[currentNodeParentIdx].priority) {
      const parent = this.heap[currentNodeParentIdx];
      this.heap[currentNodeParentIdx] = newNode;
      this.heap[currentNodeIdx] = parent;
      currentNodeIdx = currentNodeParentIdx;
      currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
    }
  }

  private bubbleDownwards() {
    let currentIdx = 0;
    let currentChildIdx: number = this.getChildFunction(currentIdx);
    while (
      this.heap[currentIdx].priority >= this.heap[currentChildIdx].priority
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

  insert(data: Vector2, priority: number) {
    const newNode = new Node(data, priority);
    this.heap.push(newNode);
    this.bubbleUpwards(newNode);
  }

  pop() {
    const toRemove = this.peek();

    if (!this.isEmpty()) {
      this.heap[0] = this.heap.pop();
    }

    if (this.heap.length <= 1) {
      const final = this.heap.pop();
      return final;
    }

    if (this.heap.length === 2) {
      if (this.heap[0].priority < this.heap[1].priority) {
        return this.heap[0];
      } else {
        return this.heap[1];
      }
    }
    this.bubbleDownwards();
    return toRemove;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
