import { Vector2 } from "../util";
import { AStar } from "./astar";

describe("astar", () => {
  it("recognizes a start = end case", () => {
    const a = new AStar({ topology: "four" });

    const path = a.compute({ x: 4, y: 5 }, { x: 4, y: 5 });
    expect(path).toEqual([{ x: 4, y: 5 }]);
  });

  it("recognizes immediate neighbors - 4", () => {
    const a = new AStar({ topology: "four" });

    const tests: [Vector2, Vector2][] = [
      [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
      ],
      [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
      ],
      [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ],
      [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ],
    ];

    for (let [v1, v2] of tests) {
      const path = a.compute(v1, v2);
      expect(path).toEqual([v1, v2]);
    }
  });

  it("recognizes immediate neighbors - 8", () => {
    const a = new AStar({ topology: "eight" });

    const tests: [Vector2, Vector2][] = [
      [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
      ],
      [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
      ],
      [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ],
      [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ],

      // Corners
      [
        { x: 5, y: 5 },
        { x: 6, y: 4 },
      ],
      [
        { x: 5, y: 5 },
        { x: 4, y: 4 },
      ],
      [
        { x: 5, y: 5 },
        { x: 4, y: 6 },
      ],
      [
        { x: 5, y: 5 },
        { x: 6, y: 6 },
      ],
    ];

    for (let [v1, v2] of tests) {
      const path = a.compute(v1, v2);
      expect(path).toEqual([v1, v2]);
    }
  });

  it("recognizes basic paths - 4", () => {
    const a = new AStar({ topology: "eight" });

    const path = a.compute({ x: 0, y: 0 }, { x: 10, y: 10 });
    expect(path).toEqual([]);
  });

  // it("recognizes a blocked path", () => { })
});
