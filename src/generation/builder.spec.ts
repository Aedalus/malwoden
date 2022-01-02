import { Table } from "../struct";
import { Builder } from "./builder";

describe("builder", () => {
  it("can take snapshots", () => {
    const b = new Builder({ width: 10, height: 10 });
    const m = b.getMap();
    const v = { x: 1, y: 1 };

    b.takeSnapshot();
    m.set(v, 10);
    b.takeSnapshot();
    m.set(v, 20);
    b.takeSnapshot();

    const s = b.getSnapshots();
    expect(s).toHaveLength(3);

    expect(s[0].get(v)).toEqual(undefined);
    expect(s[1].get(v)).toEqual(10);
    expect(s[2].get(v)).toEqual(20);
  });

  it("can clear snapshots", () => {
    const b = new Builder({ width: 10, height: 10 });

    expect(b.getSnapshots()).toHaveLength(0);
    b.takeSnapshot();
    expect(b.getSnapshots()).toHaveLength(1);
    b.clearSnapshots();
    expect(b.getSnapshots()).toHaveLength(0);
  });

  it("can start from an existing map", () => {
    const t = new Table(10, 10);
    t.fill(1);

    const b = new Builder({ width: 10, height: 10 });
    b.copyFrom(t);
    const m = b.getMap();

    expect(m.get({ x: 1, y: 1 })).toEqual(1);
    t.set({ x: 1, y: 1 }, 0);

    expect(m.get({ x: 1, y: 1 })).toEqual(1);
  });

  it("cannot copy between builders of different sizes", () => {
    const b = new Builder({ width: 10, height: 10 });
    const b2 = new Builder({ width: 20, height: 20 });

    expect(() => {
      b.copyFrom(b2.getMap());
    }).toThrowError("Cannot copy between builders of different sizes");
  });
});
