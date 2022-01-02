import { AleaRNG } from "../rand";
import { CellularAutomataBuilder } from "./cellular-automata-builder";

describe("CellularAutomata", () => {
  it("Will create with an empty table", () => {
    const width = 10;
    const height = 10;

    const a = new CellularAutomataBuilder({
      width,
      height,
      wallValue: 1,
      floorValue: 0,
    });

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        expect(a.getMap().get({ x, y })).toBeUndefined();
      }
    }
  });

  it("Will default 1/0 as Alive/Dead values", () => {
    const a = new CellularAutomataBuilder({
      width: 10,
      height: 10,
      wallValue: 1,
      floorValue: 0,
    });
    expect(a["aliveValue"]).toEqual(1);
    expect(a["deadValue"]).toEqual(0);

    const b = new CellularAutomataBuilder({
      width: 10,
      height: 10,
      wallValue: 5,
      floorValue: 4,
    });
    expect(b["aliveValue"]).toEqual(5);
    expect(b["deadValue"]).toEqual(4);
  });

  it("Can randomize with an initial value", () => {
    const width = 10;
    const height = 10;

    const a = new CellularAutomataBuilder({
      width: 10,
      height: 10,
      wallValue: 0,
      floorValue: 1,
      rng: new AleaRNG("foo"),
    });

    a.randomize(0.5);

    let alive = 0;
    let dead = 0;

    const m = a.getMap();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const val = m.get({ x, y });
        if (val === 1) alive++;
        if (val === 0) dead++;
      }
    }

    expect(alive + dead).toEqual(width * height);
    expect(Math.abs(alive - 50)).toBeLessThanOrEqual(10);
    expect(Math.abs(dead - 50)).toBeLessThanOrEqual(10);
  });

  it("Can run a simulation step", () => {
    const width = 10;
    const height = 10;
    const a = new CellularAutomataBuilder({
      width,
      height,
      wallValue: 1,
      floorValue: 0,
      rng: new AleaRNG("foo"),
    });
    a.randomize();

    a.doSimulationStep();
    expect(a.getMap().items).toMatchSnapshot();
  });

  it("Can connect areas", () => {
    const a = new CellularAutomataBuilder({
      width: 10,
      height: 10,
      wallValue: 1,
      floorValue: 0,
    });
    const m = a.getMap();
    m.fill(1);
    m.set({ x: 3, y: 3 }, 0);
    m.set({ x: 6, y: 3 }, 0);

    const results = a.connect();
    expect(results).toEqual({
      groups: [[{ x: 3, y: 3 }], [{ x: 6, y: 3 }]],
      paths: [
        [
          { x: 6, y: 3, r: 0 },
          { x: 5, y: 3, r: 1 },
          { x: 4, y: 3, r: 2 },
          { x: 3, y: 3, r: 3 },
        ],
      ],
    });
  });
});
