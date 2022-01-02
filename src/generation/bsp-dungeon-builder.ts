import { AleaRNG, IRNG } from "../rand";
import { Table, Vector2 } from "../struct";
import { Rect } from "../struct/rect";
import { Builder } from "./builder";
import { getSimpleHallwayFromRooms } from "./util";

interface BSPDungeonOptions<T> {
  width: number;
  height: number;
  wallTile: T;
  floorTile: T;
  rng?: IRNG;
}

interface BSPDungeonNodeOptions {
  v1: Vector2;
  v2: Vector2;
  rng: IRNG;
}

export class BSPDungeonNode extends Rect {
  private childA?: BSPDungeonNode;
  private childB?: BSPDungeonNode;
  private rng: IRNG;
  private leafMinWidth: number = 5;
  private leafMinHeight: number = 5;

  constructor({ v1, v2, rng }: BSPDungeonNodeOptions) {
    super(v1, v2);
    this.rng = rng;
  }

  connectChildren() {}

  private getRandomSplitDir(): "vertical" | "horizontal" {
    let splitDir: "vertical" | "horizontal" = this.rng.nextBoolean()
      ? "vertical"
      : "horizontal";
    if (this.width() > this.height() && this.width() / this.height() > 1.25) {
      splitDir = "horizontal";
    } else if (
      this.height() > this.width() &&
      this.height() / this.width() > 1.25
    ) {
      splitDir = "vertical";
    }

    return splitDir;
  }

  split() {
    if (this.getRandomSplitDir() === "horizontal") {
      this.splitHorizontal();
    } else {
      this.splitVertical();
    }
  }

  getChildren(): BSPDungeonNode[] {
    if (this.childA === undefined || this.childB === undefined) return [];
    else return [this.childA, this.childB];
  }

  isLeafNode(): boolean {
    return this.childA === undefined && this.childB === undefined;
  }

  splitVertical() {
    if (this.isLeafNode() === false) {
      throw new Error("BSPDungeonNode already split!");
    }

    const minH = this.leafMinHeight;
    const maxH = this.height() - this.leafMinHeight;
    if (maxH < minH) {
      return;
    }
    const h = this.rng.nextInt(minH, maxH);

    this.childA = new BSPDungeonNode({
      v1: { x: this.v1.x, y: this.v1.y },
      v2: { x: this.v2.x, y: this.v1.y + h - 1 },
      rng: this.rng,
    });

    this.childB = new BSPDungeonNode({
      v1: { x: this.v1.x, y: this.v1.y + h },
      v2: { x: this.v2.x, y: this.v2.y },
      rng: this.rng,
    });
  }

  splitHorizontal() {
    if (this.isLeafNode() === false) {
      throw new Error("BSPDungeonNode already split!");
    }

    const minW = this.leafMinWidth;
    const maxW = this.width() - this.leafMinWidth;
    if (maxW < minW) {
      return;
    }
    const w = this.rng.nextInt(minW, maxW);

    this.childA = new BSPDungeonNode({
      v1: { x: this.v1.x, y: this.v1.y },
      v2: { x: this.v1.x + w - 1, y: this.v2.y },
      rng: this.rng,
    });

    this.childB = new BSPDungeonNode({
      v1: { x: this.v1.x + w, y: this.v1.y },
      v2: { x: this.v2.x, y: this.v2.y },
      rng: this.rng,
    });
  }
}

/**
 * DungeonGenerator creates a number of rooms, and then works to connect
 * them.
 */
export class BSPDungeonBuilder<T> extends Builder<T> {
  private rng: IRNG;
  private hallways: Vector2[][] = [];
  private root: BSPDungeonNode;
  private rooms: Rect[] = [];
  private wallTile: T;
  private floorTile: T;

  constructor(config: BSPDungeonOptions<T>) {
    super(config);
    this.wallTile = config.wallTile;
    this.floorTile = config.floorTile;

    this.rng = config.rng ?? new AleaRNG();
    this.map.fill(this.wallTile);
    this.root = new BSPDungeonNode({
      v1: { x: 0, y: 0 },
      v2: { x: config.width - 1, y: config.height - 1 },
      rng: this.rng,
    });
  }

  getLeafNodes(): BSPDungeonNode[] {
    const leafs = [];
    const horizon = [this.root];
    while (horizon.length) {
      const node = horizon.pop()!;
      if (node.isLeafNode()) {
        leafs.push(node);
      }
      horizon.push(...node.getChildren());
    }
    return leafs;
  }

  /**
   * Splits the dungeon n times. A count of 1 would divide the dungeon in two,
   * count of 2 divides it in 4, etc.
   * @param count - number
   */
  splitByCount(count: number): void {
    for (let i = 0; i < count; i++) {
      const leafs = this.getLeafNodes();
      for (let l of leafs) {
        l.split();
      }
    }
  }

  /**
   * Creates rooms given the current BSP Tree. Use the 'split' method first to generate areas, then
   * call createRooms to generate rooms within those areas
   *
   * @param options - Options to create the rooms
   * @param options.minWidth - The minimum width of a generated room.
   * @param options.minHeight - The minimum height of a generated room.
   * @param options.maxWidth - The maximum width of a generated room. Will never be wider than the BSP area.
   * @param options.maxHeight - The maximum height of a generated room. Will never be taller than the BSP area.
   * @param options.padding - Can pad the area to ensure rooms aren't against the boundaries. Default 0.
   */
  createRooms(options: {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
    padding?: number;
  }) {
    const { minWidth, minHeight } = options;
    const padding = options.padding ?? 0;

    const leafs = this.getLeafNodes();
    for (let area of leafs) {
      const areaWidth = area.width() - padding * 2;
      const areaHeight = area.height() - padding * 2;
      const maxWidth = Math.min(options.maxWidth ?? areaWidth, areaWidth);
      const maxHeight = Math.min(options.maxHeight ?? areaHeight, areaHeight);

      if (maxWidth < minWidth || maxHeight < minHeight) continue;

      const w = this.rng.nextInt(minWidth, maxWidth);
      const h = this.rng.nextInt(minHeight, maxHeight);

      const pv1 = { x: area.v1.x + padding, y: area.v1.y + padding };
      const pv2 = { x: area.v2.x - padding, y: area.v2.y - padding };

      const randX = this.rng.nextInt(pv1.x, pv2.x - w + 1);
      const randY = this.rng.nextInt(pv1.y, pv2.y - h + 1);

      const room = Rect.FromWidthHeight({ x: randX, y: randY }, w, h);
      this.carveRoom(room);
      this.rooms.push(room);
    }
  }

  private carveRoom(room: Rect): void {
    for (let x = room.v1.x; x <= room.v2.x; x++) {
      for (let y = room.v1.y; y <= room.v2.y; y++) {
        this.map.set({ x, y }, this.floorTile);
      }
    }
  }

  /**
   * Gets all rooms created. These will each belong to a leaf node of the BSP Tree.
   * @returns Rect[] - A list of all rooms
   */
  getRooms(): Rect[] {
    return this.rooms;
  }

  /**
   * Creates simple right angle hallways between existing rooms.
   * @returns BSPDungeon - Can be used for method chaining.
   */
  createSimpleHallways() {
    this.hallways = [];
    const shuffledRooms = this.rng.shuffle(this.rooms);
    const connectedRooms: Rect[] = [];

    while (shuffledRooms.length) {
      const nextRoom = shuffledRooms.pop()!;

      // if not the first room, connect it in
      if (connectedRooms.length) {
        const roomToConnect = connectedRooms[connectedRooms.length - 1];
        const hallway = getSimpleHallwayFromRooms(nextRoom, roomToConnect);
        this.hallways.push(hallway);
      }

      connectedRooms.push(nextRoom);
    }
  }

  /**
   * Returns a list of all hallways
   * @returns Vector2[][] - The hallways
   */
  getHallways(): Vector2[][] {
    return this.hallways;
  }
}
