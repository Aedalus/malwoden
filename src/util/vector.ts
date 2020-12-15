export interface Vector2 {
  x: number;
  y: number;
}

export function areEqual(v1: Vector2, v2: Vector2): boolean {
  return v1.x === v2.x && v1.y === v2.y;
}

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
