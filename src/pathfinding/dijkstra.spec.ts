import * as Math from "../math";
import { Vector2 } from "../util";
import { Dijkstra } from "./dijkstra";

describe("dijkstra", () =>
  it("recognize as start = end case", () => {
    console.log("running test");
    const a = new Dijkstra({});
    const path = a.compute({ x: 2, y: 3 }, { x: 3, y: 3 });
    expect(path).toEqual([{ x: 3, y: 3 }]);
  }));
