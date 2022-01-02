import { AleaRNG } from "../rand";
import { DrunkardsWalkBuilder } from "./drunkards-walk-builder";

describe("Drunkards Walk", () => {
  it("Can create a basic drunkards walk", () => {
    const w = new DrunkardsWalkBuilder({
      width: 10,
      height: 10,
      rng: new AleaRNG("foo"),
      topology: "eight",
      floorTile: 0,
      wallTile: 1,
    });

    expect(w.getPaths()).toEqual([]);
    expect(w.getCoverage()).toBe(0);

    const m = w.getMap();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        expect(m.get({ x, y })).toEqual(1);
      }
    }
  });

  it("Can use topology - 8", () => {
    const w = new DrunkardsWalkBuilder({
      width: 10,
      height: 10,
      rng: new AleaRNG("foo"),
      topology: "eight",
      wallTile: 0,
      floorTile: 1,
    });

    w.walk({ stepsMin: 10, stepsMax: 10, pathCount: 2 });

    expect(w.getPaths()).toHaveLength(2);
    expect(w.getCoverage()).toBeLessThanOrEqual(1);
  });

  it("Can be given an initial point", () => {
    const w = new DrunkardsWalkBuilder({
      width: 10,
      height: 10,
      floorTile: 0,
      wallTile: 1,
    });

    w.walk({ stepsMin: 10, stepsMax: 10, start: { x: 1, y: 1 } });

    expect(w.getPaths()[0][0]).toEqual({ x: 1, y: 1 });
  });

  it("will only increment covered when it hasn't been there", () => {
    const w = new DrunkardsWalkBuilder({
      width: 10,
      height: 10,
      floorTile: 0,
      wallTile: 1,
    });

    w["addPoint"]({ x: 1, y: 1 });
    w["addPoint"]({ x: 1, y: 1 });

    expect(w.getCoverage()).toBe(1 / 100);
  });

  it("Will stop if coveredCount is reached", () => {
    const w = new DrunkardsWalkBuilder({
      width: 10,
      height: 10,
      floorTile: 0,
      wallTile: 1,
    });

    w.walk({ stepsMin: 100, stepsMax: 100, maxCoverage: 5 / 100 });

    expect(w.getCoverage()).toEqual(5 / 100);
  });
});
