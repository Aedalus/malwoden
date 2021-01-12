import { Vector } from "../math";
import { AStar } from "../pathfinding/astar";
import { Table, Vector2 } from "../util";

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
    const currentCenter = Vector.getCenter(current);
    const currentPoint = Vector.getClosest(current, currentCenter);
    const nextCenter = Vector.getCenter(next);
    const nextPoint = Vector.getClosest(next, nextCenter);

    // Get two points that are close to the edge for each section
    const closestCurrent = Vector.getClosest(next, currentPoint);
    const closestNext = Vector.getClosest(current, nextPoint);

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
