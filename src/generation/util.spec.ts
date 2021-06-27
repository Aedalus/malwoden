import { Rect } from "../util/rect";
import { getSimpleHallwayFromRooms } from "./util";

describe("getSimpleHallwayFromRooms", () => {
  // A B
  // C D
  const roomA = new Rect({ x: 1, y: 1 }, { x: 1, y: 1 });
  const roomB = new Rect({ x: 3, y: 1 }, { x: 3, y: 1 });
  const roomC = new Rect({ x: 1, y: 3 }, { x: 1, y: 3 });
  const roomD = new Rect({ x: 3, y: 3 }, { x: 3, y: 3 });

  it("can create a hallway from basic rooms - horizontal", () => {
    expect(getSimpleHallwayFromRooms(roomA, roomB)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it("can create a hallway from rooms - diagonal", () => {
    expect(getSimpleHallwayFromRooms(roomA, roomD)).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ]);
  });
});
