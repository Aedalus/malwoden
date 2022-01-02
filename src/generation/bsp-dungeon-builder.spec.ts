import { AleaRNG } from "../rand";
import { Rect } from "../struct/rect";
import { BSPDungeonBuilder, BSPDungeonNode } from "./bsp-dungeon-builder";

describe("bsp-dungeon", () => {
  it("can create a basic bsp dungeon", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });

    expect(bsp["map"]["width"]).toEqual(10);
    expect(bsp["map"]["height"]).toEqual(20);
  });

  it("can accept an rng", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
      rng: new AleaRNG(),
    });
  });

  it("can get leaf nodes with the default tree", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });
    const leafs = bsp.getLeafNodes();

    const expected = [bsp["root"]];
    expect(leafs).toEqual(expected);
  });

  it("Can split the dungeon", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });
    bsp.splitByCount(1);

    expect(bsp.getLeafNodes()).toHaveLength(2);
  });

  it("Can create rooms/hallways", () => {
    const bsp = new BSPDungeonBuilder({
      width: 40,
      height: 40,
      wallTile: 1,
      floorTile: 0,
    });
    bsp.splitByCount(1);
    bsp.createRooms({ minWidth: 3, minHeight: 3, padding: 1 });
    bsp.createSimpleHallways();

    expect(bsp.getLeafNodes()).toHaveLength(2);
    expect(bsp.getRooms()).toHaveLength(2);
    expect(bsp.getHallways()).toHaveLength(1);
  });

  it("can get a map table of all the rooms", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });
    bsp.splitByCount(1);
    bsp.createRooms({ minWidth: 3, minHeight: 3, maxWidth: 5, maxHeight: 5 });
    bsp.createSimpleHallways();

    const map = bsp.getMap();

    expect(map.width).toEqual(10);
    expect(map.height).toEqual(20);

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 20; y++) {
        expect(map.get({ x, y }) === undefined);
      }
    }
  });

  it("won't return rooms if they aren't generated", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });
    const rooms = bsp.getRooms();
    expect(rooms).toEqual([]);
  });
});

describe("bsp-node", () => {
  it("can get children nodes", () => {
    const rng = new AleaRNG();
    const a = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 5, y: 5 },
      rng,
    });
    const b = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 5, y: 5 },
      rng,
    });
    const bA = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 2, y: 5 },
      rng,
    });
    const bB = new BSPDungeonNode({
      v1: { x: 3, y: 0 },
      v2: { x: 5, y: 5 },
      rng,
    });

    b["childA"] = bA;
    b["childB"] = bB;

    expect(a.getChildren()).toEqual([]);
    expect(b.getChildren()).toEqual([bA, bB]);
  });

  it("will catch if minROom size is larger than maxRoom", () => {
    const bsp = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });
    bsp.splitByCount(2);
    bsp.createRooms({
      minHeight: 5,
      minWidth: 5,
      maxHeight: 3,
      maxWidth: 3,
    });

    const bsp2 = new BSPDungeonBuilder({
      width: 10,
      height: 20,
      wallTile: 1,
      floorTile: 0,
    });

    bsp2.splitByCount(2);
    bsp2.createRooms({
      minHeight: 5,
      minWidth: 1,
      maxHeight: 3,
      maxWidth: 3,
    });

    expect(bsp.getRooms()).toEqual([]);
    expect(bsp2.getRooms()).toEqual([]);
  });

  it("will throw an error if split multiple times", () => {
    const rng = new AleaRNG();
    const a = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 50, y: 50 },
      rng,
    });
    a.split();

    expect(() => a.splitHorizontal()).toThrow();
    expect(() => a.splitVertical()).toThrow();
  });

  it("will force a split if w/h or h/w is > 1.25", () => {
    const rng = new AleaRNG();
    const wide = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 40, y: 20 },
      rng,
    });
    const tall = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 20, y: 40 },
      rng,
    });

    expect(wide["getRandomSplitDir"]()).toEqual("horizontal");
    expect(tall["getRandomSplitDir"]()).toEqual("vertical");
  });

  it("will return without splitting if maxH < minH or maxW < minW", () => {
    const rng = new AleaRNG();
    const small = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: 3, y: 3 },
      rng,
    });
    small.splitHorizontal();
    small.splitVertical();
    expect(small.isLeafNode()).toBeTruthy();
  });
});
