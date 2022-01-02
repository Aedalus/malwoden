import { Vector2 } from "../struct";
import { AleaRNG, IRNG } from "../rand";
import { getRing4, getRing8 } from "../fov/get-ring";
import { Builder } from "./builder";

export interface DrunkardsWalkConfig<T> {
  width: number;
  height: number;
  floorTile: T;
  wallTile: T;
  rng?: IRNG;
  topology?: "four" | "eight";
}

/** Generator to perform a Drunkard's Walk*/
export class DrunkardsWalkBuilder<T> extends Builder<T> {
  private _paths: Vector2[][] = [];
  private _rng: IRNG;
  private _coveredCount: number = 0;
  private _topology: "four" | "eight";

  private _floorTile: T;
  private _wallTile: T;

  /**
   * Creates a new DrunkardsWalk Generator
   * @param config - Generator Config
   * @param config.width number - Width of the map
   * @param config.height number - Height of the map
   * @param config.rng IRNG - Optional random number generator
   * @param config.topology "four" | "eight" - Topology to use. Default four.
   * @param config.floorTile - The value to use for a path
   * @param config.wallTile - The value to use for a wall
   */
  constructor(config: DrunkardsWalkConfig<T>) {
    super(config);
    this._rng = config.rng ?? new AleaRNG();
    this._topology = config.topology ?? "four";
    this._floorTile = config.floorTile;
    this._wallTile = config.wallTile;

    // Initialize Map
    this.map.fill(this._wallTile);
  }

  /**
   * Adds a point to the drunkards walk,
   * adjusting path, table, and steps as needed.
   * @param point Vector2 - The point to add
   */
  private addPoint(point: Vector2) {
    if (this.map.get(point) !== this._floorTile) {
      this._coveredCount++;
    }
    this.map.set(point, this._floorTile);
  }

  /**
   * Returns a list of paths previously walked.
   * @returns Vector2[][]
   */
  getPaths(): Vector2[][] {
    return this._paths;
  }

  /**
   * Returns # of walked tiles / # of total tiles.
   * @returns number - Between 0.0 and 1.0
   */
  getCoverage(): number {
    const total = this.map.width * this.map.height;
    return this._coveredCount / total;
  }

  private nextStepWillOverflow(maxCoverage: number): boolean {
    const total = this.map.width * this.map.height;
    return (this._coveredCount + 1) / total > maxCoverage;
  }

  /**
   * Generate a path by walking a number of steps.
   * Can be called multiple times to have the Drunkard 'jump' to a different spot.
   * @param config - The walk configuration
   * @param config.pathCount- The number of independent paths to make from the start position. Default 1.
   * @param config.start Vector2 - The starting position. Default random.
   * @param config.stepsMin number - The minimum number of steps to take for each walk (inclusive)
   * @param config.stepsMax number - The maximum number of steps to take for each walk (exclusive)
   * @param config.maxCoverage number - Stops walking if this much of the map is explored. Range [0.0, 1.0], default 1.0
   * @returns Vector2[][] - The paths walked
   */
  walk(config: {
    pathCount?: number;
    stepsMin: number;
    stepsMax: number;
    start?: Vector2;
    maxCoverage?: number;
  }): Vector2[][] {
    const pathCount = config.pathCount ?? 1;
    const maxCoverage = config.maxCoverage ?? 1;
    const start = config.start ?? this.getRandPoint();
    const paths: Vector2[][] = [];

    // Independent walks
    for (let i = 0; i < pathCount; i++) {
      let path: Vector2[] = [start];
      this.addPoint(config.start ?? this.getRandPoint());
      const steps = this._rng.nextInt(config.stepsMin, config.stepsMax);

      for (let i = 0; i < steps; i++) {
        if (this.nextStepWillOverflow(maxCoverage)) {
          break;
        }

        const next = this.getRandomNeighbor(path[path.length - 1]);
        this.addPoint(next);
        path.push(next);
      }
      paths.push(path);
    }
    this._paths.push(...paths);
    return paths;
  }

  private getRandPoint() {
    const x = this._rng.nextInt(0, this.map.width);
    const y = this._rng.nextInt(0, this.map.height);
    return { x, y };
  }

  private getRandomNeighbor(pos: Vector2): Vector2 {
    let next: Vector2 | undefined = undefined;
    while (next === undefined) {
      // Get next neighbor
      const neighbors =
        this._topology === "four"
          ? getRing4(pos.x, pos.y, 1)
          : getRing8(pos.x, pos.y, 1);

      const n = this._rng.nextItem(neighbors)!;

      // Check if it is in bounds
      if (this.map.isInBounds(n)) {
        next = n;
      }
    }
    return next;
  }
}
