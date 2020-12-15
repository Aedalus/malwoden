import { PriorityQueue } from "./priority-queue";
import { Vector2 } from "./vector";

describe("PriorityQueue", () => {
  it("Can take in numbers", () => {
    const q = new PriorityQueue((n: number) => n);

    q.insert(1000);
    q.insert(100);
    q.insert(10);
    q.insert(1);

    expect(q.pop()).toEqual(1);
    expect(q.pop()).toEqual(10);
    expect(q.pop()).toEqual(100);
    expect(q.pop()).toEqual(1000);
  });

  it("Can take in objects", () => {
    const q = new PriorityQueue((v: Vector2) => v.x);

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
    const q = new PriorityQueue((v: Vector2) => v.x);

    for (let y = 0; y < 100; y++) {
      q.insert({ x: 0, y });
    }

    for (let y = 0; y < 100; y++) {
      expect(q.pop()).toEqual({ x: 0, y });
    }
  });
});
