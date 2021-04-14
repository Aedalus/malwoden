import { Vector2 } from "../util";

/**
 * A function used to tell if a space is blocked.
 * Can be a bit more intuitive than using a distance
 * callback with Infinity values.
 */
export interface IsBlockedCallback {
  (v: Vector2): boolean;
}

/**
 * A function that returns the distance between two points.
 * Commonly used to get terrain costs, with 'from' being ignored.
 */
export interface DistanceCallback {
  (from: Vector2, to: Vector2): number;
}

/** A Vector2 that includes a range from an origin point */
export interface RangeVector2 {
  /** The x coordinate */
  x: number;
  /** The y coordinate */
  y: number;
  /** The range */
  r: number;
}
