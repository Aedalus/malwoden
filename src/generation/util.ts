import * as Calc from "../calc";
import { AStar } from "../pathfinding/astar";
import { IRNG } from "../rand";
import { Table, Vector2 } from "../struct";
import { Rect } from "../struct/rect";

export interface ConnectData {
  groups: Vector2[][];
  paths: Vector2[][];
}

/**
 * Connects areas of the map to ensure they are all connected.
 *
 * For instance, if you're using an alive value of 1 for walls,
 * then this can connect the dead value of 0 to ensure all
 * squares on the map are accessable.
 *
 * @param value The value to connect (default this.deadValue)
 */
export function connect<T>(table: Table<T>, value: T): ConnectData {
  const spacesToConnect = new Set<string>();
  const groups: Vector2[][] = [];
  const paths: Vector2[][] = [];

  // Get all spaces with the value
  for (let x = 0; x < table.width; x++) {
    for (let y = 0; y < table.height; y++) {
      if (table.get({ x, y }) === value) {
        spacesToConnect.add(`${x}:${y}`);
      }
    }
  }

  // Figure out which groups there are
  while (spacesToConnect.size > 0) {
    const [v] = Array.from(spacesToConnect.entries())[0];
    const [x, y] = v.split(":");
    const position = {
      x: Number.parseInt(x),
      y: Number.parseInt(y),
    };

    // Grab an area, then remove those tiles from the spacesToConnect
    const selection = table.floodFillSelect(position);
    groups.push(selection);
    for (let s of selection) {
      spacesToConnect.delete(`${s.x}:${s.y}`);
    }
  }

  // spacesToConnect is now empty.
  // Each group in groups is an isolated set of tiles

  for (let i = 0; i < groups.length; i++) {
    // Ignore the last group
    if (i === groups.length - 1) break;
    const current = groups[i];
    const next = groups[i + 1];

    // Get the center point from each area
    const currentCenter = Calc.Vector.getCenter(current);
    const currentPoint = Calc.Vector.getClosest(current, currentCenter);
    const nextCenter = Calc.Vector.getCenter(next);
    const nextPoint = Calc.Vector.getClosest(next, nextCenter);

    // Get two points that are close to the edge for each section
    const closestCurrent = Calc.Vector.getClosest(next, currentPoint);
    const closestNext = Calc.Vector.getClosest(current, nextPoint);

    const a = new AStar({ topology: "four" });
    const connection = a.compute(closestCurrent, closestNext);

    // Connect the paths
    if (!connection) throw new Error("Error: Could not connect cell areas");
    for (let v of connection) {
      table.set(v, value);
    }

    paths.push(connection);
  }

  return {
    groups,
    paths,
  };
}

export function getSimpleHallwayFromRooms(a: Rect, b: Rect): Vector2[] {
  const hallway: Vector2[] = [];

  const start = a.center();
  const end = b.center();

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);

  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  // Connect the vertical
  // Connect the horizontal
  for (let y = minY; y <= maxY; y++) {
    hallway.push({ x: start.x, y });
  }

  for (let x = minX + 1; x <= maxX; x++) {
    hallway.push({ x: x, y: end.y });
  }

  return hallway;
}
