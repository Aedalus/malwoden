import * as Calc from "../calc";
import { Vector2 } from "../util";
import { Dijkstra } from "./dijkstra";

describe("dijkstra", () => {
  it("recognize as start = end case", () => {
    const a = new Dijkstra({ topology: "four" });
    const path = a.compute({ x: 2, y: 3 }, { x: 2, y: 3 });
    expect(path).toEqual([{ x: 2, y: 3 }]);
  });

  it("recognizes immediate neighbors - 4", () => {
    const a = new Dijkstra({ topology: "four" });

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

  it("recognizes basic paths - 4", () => {
    const a = new Dijkstra({ topology: "four" });

    const path = a.compute({ x: 0, y: 0 }, { x: 5, y: 5 });
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 5, y: 2 },
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
    ]);
  });

  it("recognizes basic paths - 8", () => {
    const a = new Dijkstra({ topology: "eight" });

    const path = a.compute({ x: 0, y: 0 }, { x: 10, y: 10 });
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 6 },
      { x: 7, y: 7 },
      { x: 8, y: 8 },
      { x: 9, y: 9 },
      { x: 10, y: 10 },
    ]);
  });

  it("recognizes blocked paths - 4", () => {
    const a = new Dijkstra({
      topology: "four",
      isBlockedCallback: (v) =>
        Calc.Vector.areEqual(v, { x: 1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: -1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: 0, y: 1 }) ||
        Calc.Vector.areEqual(v, { x: 0, y: -1 }),
    });
    const path = a.compute({ x: 0, y: 0 }, { x: 5, y: 5 });
    expect(path).toEqual(undefined);
  });

  it("recognizes blocked paths - 8", () => {
    const a = new Dijkstra({
      topology: "eight",
      isBlockedCallback: (v) =>
        Calc.Vector.areEqual(v, { x: 1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: -1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: 0, y: 1 }) ||
        Calc.Vector.areEqual(v, { x: 0, y: -1 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: -1 }) ||
        Calc.Vector.areEqual(v, { x: -1, y: -1 }) ||
        Calc.Vector.areEqual(v, { x: -1, y: 1 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: 1 }),
    });
    const path = a.compute({ x: 0, y: 0 }, { x: 5, y: 5 });
    expect(path).toEqual(undefined);
  });

  it("recognizes basic obstacles - 4", () => {
    const a = new Dijkstra({
      topology: "four",
      isBlockedCallback: (v) =>
        Calc.Vector.areEqual(v, { x: 1, y: -1 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: 1 }),
    });
    const path = a.compute({ x: 0, y: 0 }, { x: 2, y: 0 });
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: -2 },
      { x: 1, y: -2 },
      { x: 2, y: -2 },
      { x: 2, y: -1 },
      { x: 2, y: 0 },
    ]);
  });

  it("recognizes basic obstacles - 8", () => {
    const a = new Dijkstra({
      topology: "eight",
      isBlockedCallback: (v) =>
        Calc.Vector.areEqual(v, { x: 1, y: -1 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: 0 }) ||
        Calc.Vector.areEqual(v, { x: 1, y: 1 }),
    });
    const path = a.compute({ x: 0, y: 0 }, { x: 2, y: 0 });
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -2 },
      { x: 2, y: -1 },
      { x: 2, y: 0 },
    ]);
  });
});
