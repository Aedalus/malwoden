import { PriorityQueue } from "./min-priority-queue";
import { Vector2 } from "./vector";

describe("PriorityQueue", () => {
  it("Can take in numbers", () => {
    const q = new PriorityQueue();

    q.insert({ x: 0, y: 1 }, 10);
    console.log(q);

    // 10
    q.insert({ x: 0, y: 1 }, 4);
    console.log(q);

    //   10
    // 60

    q.insert({ x: 0, y: 1 }, 15);
    console.log(q);
    // q.pop();
    //   10
    // 60 100
    q.insert({ x: 0, y: 1 }, 20);
    console.log(q);

    //     10
    //   60 100
    // 1000

    q.insert({ x: 0, y: 1 }, 0);
    console.log(q);

    //    10
    //   60 100
    // 1000  1
    // bubble happens

    //    10
    //   60  1
    // 1000  100

    //       1
    //    60   10
    // 1000     100
    q.insert({ x: 0, y: 1 }, 30);
    // q.pop();
    // q.pop();
    q.insert({ x: 0, y: 1 }, 2);
    q.insert({ x: 0, y: 1 }, 4);
    q.insert({ x: 0, y: 1 }, -1);
    q.insert({ x: 0, y: 1 }, -3); // ten inserts

    console.log(q);
    while (!q.isEmpty()) {
      console.log("final test pop is: ", q.pop());
      console.log(q);
    }
  });
});
