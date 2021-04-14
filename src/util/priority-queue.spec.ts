import { HeapPriorityQueue } from "./priority-queue";
import { Vector2 } from "./vector";

describe("PriorityQueue", () => {
  it("Can take in numbers", () => {
    const q = new HeapPriorityQueue((n: number) => n);

    q.insert(1000);
    q.insert(100);
    q.insert(10);
    q.insert(1);

    expect(q.pop()).toEqual(1);
    expect(q.pop()).toEqual(10);
    expect(q.pop()).toEqual(100);
    expect(q.pop()).toEqual(1000);
  });

  it("Can peek at the top entry", () => {
    const q = new HeapPriorityQueue((n: number) => n);

    q.insert(100);
    q.insert(50);
    q.insert(500);

    expect(q.peek()).toEqual(50);
    expect(q.peek()).toEqual(50);
    expect(q.peek()).toEqual(50);
  });

  it("Will return undefined when peeking at an empty queue", () => {
    const q = new HeapPriorityQueue((n: number) => n);

    expect(q.peek()).toEqual(undefined);
  });

  it("Will return undefined when popping an empty queue", () => {
    const q = new HeapPriorityQueue((n: number) => n);

    expect(q.pop()).toEqual(undefined);
  });

  it("Can take in objects", () => {
    const q = new HeapPriorityQueue((v: Vector2) => v.x);

    q.insert({ x: 100, y: 10 });
    q.insert({ x: 10, y: 10 });
    q.insert({ x: 1, y: 10 });
    q.insert({ x: -1, y: 10 });
    q.insert({ x: -10, y: 10 });
    q.insert({ x: -100, y: 10 });

    expect(q.pop()).toEqual({ x: -100, y: 10 });
    expect(q.pop()).toEqual({ x: -10, y: 10 });
    expect(q.pop()).toEqual({ x: -1, y: 10 });
    expect(q.pop()).toEqual({ x: 1, y: 10 });
    expect(q.pop()).toEqual({ x: 10, y: 10 });
    expect(q.pop()).toEqual({ x: 100, y: 10 });
  });

  it("Will prioritize object inserted first", () => {
    const q = new HeapPriorityQueue((v: Vector2) => v.x);

    for (let y = 0; y < 100; y++) {
      q.insert({ x: 0, y });
    }

    for (let y = 0; y < 100; y++) {
      expect(q.pop()).toEqual({ x: 0, y });
    }
  });
});
