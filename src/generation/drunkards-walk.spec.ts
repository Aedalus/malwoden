import { AleaRNG } from "../rand";
import { DrunkardsWalk } from "./drunkards-walk";

describe("Drunkards Walk", () => {
  it("Can create a basic drunkards walk", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
      rng: new AleaRNG("foo"),
      topology: "eight",
    });

    expect(w.getPath()).toEqual([]);
    expect(w.getSteps()).toEqual(0);
    expect(w.getCurrent()).toBeUndefined();

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        expect(w.table.get({ x, y })).toEqual(0);
      }
    }
  });

  it("Can use topology - 8", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
      rng: new AleaRNG("foo"),
      topology: "eight",
    });

    w.walkSteps({ steps: Infinity, maxCoveredTiles: 10 });

    expect(w.getSteps()).toBeGreaterThanOrEqual(10);
    expect(w.getPath().length).toBeGreaterThanOrEqual(10);
    expect(w.getCoveredCount()).toEqual(10);
  });

  it("Can be given an initial point", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
    });

    w.walkSteps({ steps: 10, start: { x: 1, y: 1 } });

    expect(w.getSteps()).toEqual(10);
    expect(w.getPath()[0]).toEqual({ x: 1, y: 1 });
  });

  it("Can add an additional point", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
    });

    w.addPoint({ x: 1, y: 1 });
    w.addPoint({ x: 2, y: 2 });

    expect(w.getPath()).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ]);
    expect(w.getSteps()).toEqual(2);
    expect(w.getCurrent()).toEqual({ x: 2, y: 2 });
  });

  it("will only increment covered when it hasn't been there", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
    });

    w.addPoint({ x: 1, y: 1 });
    w.addPoint({ x: 1, y: 1 });

    expect(w.getSteps()).toBe(2);
    expect(w.getPath()).toHaveLength(2);
    expect(w.getCoveredCount()).toBe(1);
  });

  it("Can walk steps", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
    });

    w.walkSteps({ steps: 10 });
    expect(w.getSteps()).toBe(10);
    expect(w.getPath()).toHaveLength(10);
  });

  it("Will stop if coveredCount is reached", () => {
    const w = new DrunkardsWalk({
      width: 10,
      height: 10,
    });

    w.walkSteps({ steps: 3, maxCoveredTiles: 2 });

    expect(w.getSteps()).toEqual(2);
    expect(w.getPath()).toHaveLength(2);
  });
});
