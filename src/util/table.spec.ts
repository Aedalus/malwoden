import { Table } from "./table";

describe("table", () => {
  it("is initialized to undefined values", () => {
    const t = new Table<number>(10, 10);

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        expect(t.get({ x, y })).toEqual(undefined);
      }
    }
  });

  it("can fill the entire table", () => {
    const t = new Table<number>(10, 10);

    for (let i = 0; i < 10; i++) {
      t.fill(i);

      for (let x = 0; x < t.width; x++) {
        for (let y = 0; y < t.height; y++) {
          expect(t.get({ x, y })).toEqual(i);
        }
      }
    }
  });

  it("will return undefined if retrieving a value out of bounds", () => {
    const t = new Table<number>(10, 10);
    t.fill(10);

    expect(t.get({ x: -10, y: 10 })).toEqual(undefined);
    expect(t.get({ x: 10, y: -10 })).toEqual(undefined);
    expect(t.get({ x: -10, y: -10 })).toEqual(undefined);
  });
  it("can set and unset values", () => {
    const t = new Table<number>(10, 10);

    expect(t.get({ x: 0, y: 0 })).toEqual(undefined);

    t.set({ x: 0, y: 0 }, 1);

    expect(t.get({ x: 0, y: 0 })).toEqual(1);
    expect(t.get({ x: 0, y: 0 })).not.toEqual(undefined);

    t.set({ x: 0, y: 0 }, undefined);
    expect(t.get({ x: 0, y: 0 })).toEqual(undefined);
  });

  it("will throw an error if setting out of bounds", () => {
    const t = new Table<number>(10, 10);

    const tests: [number, number, string][] = [
      [-1, 0, "-1:0 is not in bounds"],
      [0, -1, "0:-1 is not in bounds"],
      [-1, -1, "-1:-1 is not in bounds"],
      [10, 10, "10:10 is not in bounds"],
      [100, 100, "100:100 is not in bounds"],
      [Infinity, Infinity, "Infinity:Infinity is not in bounds"],
    ];

    for (let [x, y, result] of tests) {
      expect(() => t.set({ x: x, y: y }, 100)).toThrowError(result);
    }
  });

  it("can get neighbors - topology 4", () => {
    const t = new Table<number>(10, 10);

    // Corner Case
    const cornerNeighbors = t.getNeighbors({ x: 0, y: 0 }, undefined, "four");
    expect(cornerNeighbors).toHaveLength(2);
    expect(cornerNeighbors).toContainEqual({ x: 1, y: 0 });
    expect(cornerNeighbors).toContainEqual({ x: 0, y: 1 });

    // General case
    const neighbors = t.getNeighbors({ x: 5, y: 5 }, undefined, "four");
    expect(neighbors).toHaveLength(4);
    expect(neighbors).toContainEqual({ x: 6, y: 5 });
    expect(neighbors).toContainEqual({ x: 4, y: 5 });
    expect(neighbors).toContainEqual({ x: 5, y: 4 });
    expect(neighbors).toContainEqual({ x: 5, y: 6 });
  });

  it("can get neighbors - topology 8", () => {
    const t = new Table<number>(10, 10);

    // Corner Case
    const cornerNeighbors = t.getNeighbors({ x: 0, y: 0 });
    expect(cornerNeighbors).toHaveLength(3);
    expect(cornerNeighbors).toContainEqual({ x: 1, y: 0 });
    expect(cornerNeighbors).toContainEqual({ x: 0, y: 1 });
    expect(cornerNeighbors).toContainEqual({ x: 1, y: 1 });

    // General case
    const neighbors = t.getNeighbors({ x: 5, y: 5 });

    expect(neighbors).toHaveLength(8);

    // Cardinal
    expect(neighbors).toContainEqual({ x: 6, y: 5 });
    expect(neighbors).toContainEqual({ x: 4, y: 5 });
    expect(neighbors).toContainEqual({ x: 5, y: 4 });
    expect(neighbors).toContainEqual({ x: 5, y: 6 });

    // Diagonals
    expect(neighbors).toContainEqual({ x: 6, y: 6 });
    expect(neighbors).toContainEqual({ x: 4, y: 6 });
    expect(neighbors).toContainEqual({ x: 4, y: 4 });
    expect(neighbors).toContainEqual({ x: 6, y: 4 });
  });

  it("can get neighbords - predicate", () => {
    const t = new Table<number>(10, 10);

    const n = t.getNeighbors({ x: 0, y: 0 }, (pos, _) => pos.x == 1, "eight");
    expect(n).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it("can floodfillSelect", () => {
    let t = new Table(10, 10);
    let selection = t.floodFillSelect({ x: 0, y: 0 });

    expect(selection).toHaveLength(100);

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        expect(selection).toContainEqual({ x, y });
      }
    }

    t = new Table(10, 10);
    // Test no value
    selection = t.floodFillSelect({ x: 5, y: 5 }, 1);
    expect(selection).toHaveLength(0);
    expect(selection).toEqual([]);

    // Test a single value
    t.set({ x: 5, y: 5 }, 1);
    selection = t.floodFillSelect({ x: 5, y: 5 });
    expect(selection).toHaveLength(1);
    expect(selection).toContainEqual({ x: 5, y: 5 });

    // Throw some more in
    const vs = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 4, y: 5 },
      { x: 7, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
    ];

    for (let v of vs) {
      t.set(v, 1);
    }

    selection = t.floodFillSelect({ x: 5, y: 5 });
    expect(selection).toHaveLength(vs.length);

    for (let v of vs) {
      expect(selection).toContainEqual(v);
    }
  });
});
