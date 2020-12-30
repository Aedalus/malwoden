import { Vector2 } from "../util/vector";

/**
 * Returns true if two vectors have the same x and y values.
 * @param v1 The first Vector2.
 * @param v2 The second Vector2.
 */
export function areEqual(v1: Vector2, v2: Vector2): boolean {
  return v1.x === v2.x && v1.y === v2.y;
}

/**
 * Returns the distance between two vectors.
 *
 * If topology is four, diagonal distance is 2.
 * If topology is eight, diagonal distance is 1.
 * @param start The starting Vector2.
 * @param end The ending Vector2.
 * @param topology Either 'four' or 'eight'. Default 'four'
 */
export function getDistance(
  start: Vector2,
  end: Vector2,
  topology: "four" | "eight" = "four"
): number {
  if (topology === "four") {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  } else {
    return Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y));
  }
}

/**
 * Will find the center of an area by averaging all Vectors in the area.
 * This point may not be in the area itself, for example in a donut shaped area.
 * @param area Vector2
 */
export function getCenter(area: Vector2[]): Vector2 {
  if (area.length < 1) {
    throw new Error("Error: Trying to find center of empty area");
  }

  let sx = 0;
  let sy = 0;

  for (let v of area) {
    sx += v.x;
    sy += v.y;
  }

  return {
    x: sx / area.length,
    y: sy / area.length,
  };
}

/**
 * Will find the position in the area closest to the target
 * @param area Vector2[]
 * @param target Vector2
 * @param topology Either 'four' or 'eight'. Default 'four'
 */
export function getClosest(
  area: Vector2[],
  target: Vector2,
  topology: "four" | "eight" = "four"
): Vector2 {
  // Throw an error if area is empty
  if (area.length < 1) {
    throw new Error("Error: Trying to find closest position of an empty area");
  }

  // Keep track of the closest we've found.
  let minDistance = Infinity;
  let closest: Vector2 = area[0];

  for (let v of area) {
    let distance = getDistance(target, v, topology);
    // Found exact one, immediately return
    if (distance === 0) {
      return {
        x: target.x,
        y: target.y,
      };
    }

    // Closer than currently known
    if (distance < minDistance) {
      minDistance = distance;
      closest = v;
    }
  }

  return closest;
}
