import { Vector2 } from "../util";

export function getRing8(
  originX: number,
  originY: number,
  range: number
): Vector2[] {
  if (range === 0) return [{ x: originX, y: originY }];

  const ring: Vector2[] = [];
  const maxX = originX + range;
  const minX = originX - range;
  const maxY = originY + range;
  const minY = originY - range;

  //Start at the 3 o'clock, (0 degrees), rotate all the way around
  // Top Right Side, no corner
  for (let x = maxX, y = originY; y > minY; y--) {
    ring.push({ x, y });
  }

  // Top Side, right to left. Include top corners
  for (let x = maxX, y = minY; x >= minX; x--) {
    ring.push({ x, y });
  }

  // Left side, no corners
  for (let x = minX, y = minY + 1; y < maxY; y++) {
    ring.push({ x, y });
  }

  // Bottom side, corners
  for (let x = minX, y = maxY; x <= maxX; x++) {
    ring.push({ x, y });
  }

  // Right side back to to 0 degrees, no corner
  for (let x = maxX, y = maxY - 1; y > originY; y--) {
    ring.push({ x, y });
  }

  return ring;
}

export function getRing4(
  originX: number,
  originY: number,
  range: number
): Vector2[] {
  if (range === 0) {
    return [
      {
        x: originX,
        y: originY,
      },
    ];
  }
  const ring: Vector2[] = [];

  const maxX = originX + range;
  const minX = originX - range;
  const maxY = originY + range;
  const minY = originY - range;

  // Top right arc
  for (let x = maxX, y = originY; x > originX; x--, y--) {
    ring.push({ x, y });
  }

  // Top left arc
  for (let x = originX, y = minY; x > minX; x--, y++) {
    ring.push({ x, y });
  }

  // Bottom left arc
  for (let x = minX, y = originY; x < originX; x++, y++) {
    ring.push({ x, y });
  }

  // Bottom right arc
  for (let x = originX, y = maxY; x < maxX; x++, y--) {
    ring.push({ x, y });
  }

  return ring;
}
