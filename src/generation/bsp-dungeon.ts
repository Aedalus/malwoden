import { AleaRNG, IRNG } from "../rand";
import { Table, Vector2 } from "../util";
import { Rect } from "../util/rect";
import { getSimpleHallwayFromRooms } from "./util";

interface BSPDungeonOptions {
  rng: IRNG;
}

/**
 * A node representing an area within the BSPDungeon. Each of these nodes
 * will have either no children, or exactly two children.
 */
export class BSPNode extends Rect {
  depth: number;
  room?: Rect;
  children?: {
    a: BSPNode;
    b: BSPNode;
  };

  constructor(v1: Vector2, v2: Vector2, depth: number) {
    super(v1, v2);
    this.depth = depth;
  }

  getChildren(): BSPNode[] {
    if (!this.children) return [];
    else return [this.children.a, this.children.b];
  }
}

/**
 * DungeonGenerator creates a number of rooms, and then works to connect
 * them.
 */
export class BSPDungeon {
  private width: number;
  private height: number;
  private rng: IRNG;

  private tree: BSPNode;
  private hallways: Vector2[][] = [];

  constructor(
    width: number,
    height: number,
    config: Partial<BSPDungeonOptions> = {}
  ) {
    this.width = width;
    this.height = height;

    this.rng = config.rng ?? new AleaRNG(Date.now().toString());
    this.tree = new BSPNode({ x: 0, y: 0 }, { x: width, y: height }, 0);
  }

  /**
   * Splits the initial BSP into multiple rooms. Clears any existing rooms
   * or corridors.
   * @param options Options to split the rooms
   * @param options.depth The number of times to split the rooms
   */
  split(options: { depth: number }): BSPDungeon {
    this.hallways = [];
    this.splitUntilDepth(options.depth);
    return this;
  }

  /**
   * Returns a list of leaf nodes. These are the areas of the map
   * that have been divided. Use createRooms to create rooms spaced
   * out between these areas.
   *
   * @returns []BSPNode - The leaf nodes
   */
  getLeafNodes(): BSPNode[] {
    const leafs: BSPNode[] = [];
    const horizon = [this.tree];
    while (horizon.length > 0) {
      const node = horizon.pop()!;
      if (!node.children) {
        leafs.push(node);
      } else {
        horizon.push(node.children.a, node.children.b);
      }
    }
    return leafs;
  }

  private getNonLeafNodes(): BSPNode[] {
    const nonLeafs: BSPNode[] = [];
    const horizon = [this.tree];
    while (horizon.length > 0) {
      const node = horizon.pop()!;
      if (node.children) {
        nonLeafs.push(node);
        horizon.push(node.children.a, node.children.b);
      }
    }
    return nonLeafs;
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
   */
  createRooms(options: {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
  }): BSPDungeon {
    let { minWidth, minHeight } = options;

    // Add one to each here, as the wall doesn't count
    minWidth = minWidth;
    minHeight = minHeight;

    const leafs = this.getLeafNodes();
    for (let area of leafs) {
      // Ensure maxWidth/Height don't exceed room dimensions
      const maxWidth = Math.min(area.width() - 3, options.maxWidth ?? Infinity);
      const maxHeight = Math.min(
        area.height() - 3,
        options.maxHeight ?? Infinity
      );

      // Skip rooms if they are too narrow
      if (minWidth > maxWidth) continue;
      if (minHeight > maxHeight) continue;

      const width = this.rng.nextInt(minWidth, maxWidth);
      const height = this.rng.nextInt(minHeight, maxHeight);

      const startX = this.rng.nextInt(area.v1.x + 1, area.v2.x - width);
      const startY = this.rng.nextInt(area.v1.y + 1, area.v2.y - height);

      area.room = new Rect(
        { x: startX, y: startY },
        { x: startX + width, y: startY + height }
      );
    }

    return this;
  }

  /**
   * Gets all rooms created. These will each belong to a leaf node of the BSP Tree.
   * @returns Rect[] - A list of all rooms
   */
  getRooms(): Rect[] {
    const rooms: Rect[] = [];
    for (let node of this.getLeafNodes()) {
      if (node.room) {
        rooms.push(node.room);
      }
    }
    return rooms;
  }

  /**
   * Creates simple right angle hallways between existing rooms.
   * @returns BSPDungeon - Can be used for method chaining.
   */
  createSimpleHallways(): BSPDungeon {
    this.hallways = [];
    const rooms = this.getLeafNodes();

    const shuffledNodes = this.rng.shuffle(rooms);
    const shuffledRooms = this.getRoomsFromBSPNodes(shuffledNodes);
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

    return this;
  }

  /**
   * Returns a list of all hallways
   * @returns Vector2[][] - The hallways
   */
  getHallways(): Vector2[][] {
    return this.hallways;
  }

  /**
   * Returns a table representing the open spaces from
   * the hallways and rooms.
   * @param wall T - The value to use for a wall. Open spaces will be undefined.
   * @returns Table<T> - The rendered table.
   */
  getMapTable<T = boolean>(wall: T): Table<T> {
    const table = new Table<T>(this.width, this.height);
    table.fill(wall);

    // carve out each room
    for (const room of this.getRooms()) {
      for (let x = room.v1.x; x < room.v2.x; x++) {
        for (let y = room.v1.y; y < room.v2.y; y++) {
          table.clear({ x, y });
        }
      }
    }

    for (const hallway of this.getHallways()) {
      for (const tile of hallway) {
        table.clear(tile);
      }
    }

    return table;
  }

  private splitUntilDepth(targetDepth: number) {
    const horizon = [this.tree];

    while (horizon.length) {
      const node = horizon.pop()!;
      if (node.depth >= targetDepth) continue;

      if (this.rng.nextBoolean()) {
        // split horizontal
        const split = Math.round((node.v1.x + node.v2.x) / 2);
        node.children = {
          a: new BSPNode(
            { x: node.v1.x, y: node.v1.y },
            { x: split, y: node.v2.y },
            node.depth + 1
          ),
          b: new BSPNode(
            { x: split, y: node.v1.y },
            { x: node.v2.x, y: node.v2.y },
            node.depth + 1
          ),
        };
      } else {
        // split vertical
        const split = Math.round((node.v1.y + node.v2.y) / 2);
        node.children = {
          a: new BSPNode(
            { x: node.v1.x, y: node.v1.y },
            { x: node.v2.x, y: split },
            node.depth + 1
          ),
          b: new BSPNode(
            { x: node.v1.x, y: split },
            { x: node.v2.x, y: node.v2.y },
            node.depth + 1
          ),
        };
      }

      // enqueue children if the exist
      horizon.push(...node.getChildren());
    }
  }

  private getRoomsFromBSPNodes(nodes: BSPNode[]): Rect[] {
    const rooms: Rect[] = [];

    for (let n of nodes) {
      if (n.room) {
        rooms.push(n.room);
      }
    }

    return rooms;
  }
}
