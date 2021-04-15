import { AleaRNG } from "../rand";
import { CellularAutomata } from "./cellular-automata";

describe("CellularAutomata", () => {
  it("Will create with an empty table", () => {
    const width = 10;
    const height = 10;

    const a = new CellularAutomata(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        expect(a.table.get({ x, y })).toBeUndefined();
      }
    }
  });

  it("Will default 1/0 as Alive/Dead values", () => {
    const a = new CellularAutomata(10, 10);
    expect(a.aliveValue).toEqual(1);
    expect(a.deadValue).toEqual(0);

    const b = new CellularAutomata(10, 10, { aliveValue: 5, deadValue: 4 });
    expect(b.aliveValue).toEqual(5);
    expect(b.deadValue).toEqual(4);
  });

  it("Can randomize with an initial value", () => {
    const width = 10;
    const height = 10;

    const a = new CellularAutomata(width, height, { rng: new AleaRNG("foo") });

    a.randomize(0.5);

    let alive = 0;
    let dead = 0;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const val = a.table.get({ x, y });
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
    const a = new CellularAutomata(width, height, { rng: new AleaRNG("foo") });
    a.randomize();

    a.doSimulationStep();
    expect(a.table.items).toMatchSnapshot();
  });

  it("Can connect areas", () => {
    const a = new CellularAutomata(10, 10);
    a.table.fill(1);
    a.table.set({ x: 3, y: 3 }, 0);
    a.table.set({ x: 6, y: 3 }, 0);

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
