import { AleaRNG } from "../rand";
import { Rect } from "../struct/rect";
import { BSPDungeon, BSPNode } from "./bsp-dungeon";

describe("bsp-dungeon", () => {
  it("can create a basic bsp dungeon", () => {
    const bsp = new BSPDungeon(10, 20);

    expect(bsp["width"]).toEqual(10);
    expect(bsp["height"]).toEqual(20);
  });

  it("can accept an rng", () => {
    const bsp = new BSPDungeon(10, 20, {
      rng: new AleaRNG(),
    });
  });
  it("can get leaf nodes with the default tree", () => {
    const bsp = new BSPDungeon(10, 20);
    const leafs = bsp.getLeafNodes();

    const expected = [bsp["tree"]];
    expect(leafs).toEqual(expected);
  });

  it("Can split the dungeon", () => {
    const bsp = new BSPDungeon(10, 20);
    bsp.split({ depth: 1 });

    expect(bsp.getLeafNodes()).toHaveLength(2);
    expect(bsp["getNonLeafNodes"]()).toHaveLength(1);
  });

  it("Can create rooms/hallways", () => {
    const bsp = new BSPDungeon(10, 20)
      .split({ depth: 1 })
      .createRooms({
        minWidth: 3,
        minHeight: 3,
      })
      .createSimpleHallways();

    expect(bsp.getLeafNodes()).toHaveLength(2);
    expect(bsp.getRooms()).toHaveLength(2);
    expect(bsp.getHallways()).toHaveLength(1);
  });

  it("can get a map table of all the rooms", () => {
    const bsp = new BSPDungeon(10, 20)
      .split({ depth: 1 })
      .createRooms({ minWidth: 3, minHeight: 3, maxWidth: 5, maxHeight: 5 })
      .createSimpleHallways();

    const map = bsp.getMapTable(true);

    expect(map.width).toEqual(10);
    expect(map.height).toEqual(20);

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 20; y++) {
        expect(map.get({ x, y }) === undefined);
      }
    }
  });

  it("won't return rooms if they aren't generated", () => {
    const bsp = new BSPDungeon(10, 20).split({ depth: 2 });

    const rooms = bsp.getRooms();
    expect(rooms).toEqual([]);
  });
});

describe("bsp-node", () => {
  it("can get children nodes", () => {
    const a = new BSPNode({ x: 0, y: 0 }, { x: 5, y: 5 }, 1);
    const b = new BSPNode({ x: 0, y: 0 }, { x: 5, y: 5 }, 1);
    const bA = new BSPNode({ x: 0, y: 0 }, { x: 2, y: 5 }, 2);
    const bB = new BSPNode({ x: 3, y: 0 }, { x: 5, y: 5 }, 2);
    b.children = {
      a: bA,
      b: bB,
    };

    expect(a.getChildren()).toEqual([]);
    expect(b.getChildren()).toEqual([bA, bB]);
  });

  it("will catch if minROom size is larger than maxRoom", () => {
    const bsp = new BSPDungeon(10, 20).split({ depth: 2 }).createRooms({
      minHeight: 5,
      minWidth: 5,
      maxHeight: 3,
      maxWidth: 3,
    });

    const bsp2 = new BSPDungeon(10, 20).split({ depth: 2 }).createRooms({
      minHeight: 5,
      minWidth: 1,
      maxHeight: 3,
      maxWidth: 3,
    });

    expect(bsp.getRooms()).toEqual([]);
    expect(bsp2.getRooms()).toEqual([]);
  });

  it("can convert nodes to rooms", () => {
    const bsp = new BSPDungeon(10, 20);

    const a = new BSPNode({ x: 0, y: 0 }, { x: 3, y: 3 }, 1);
    const b = new BSPNode({ x: 5, y: 5 }, { x: 10, y: 10 }, 1);
    b.room = new Rect({ x: 6, y: 6 }, { x: 7, y: 7 });
    const rooms = bsp["getRoomsFromBSPNodes"]([a, b]);

    expect(rooms).toEqual([b.room]);
  });
});
