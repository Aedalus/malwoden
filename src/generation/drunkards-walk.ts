import { Table, Vector2 } from "../util";
import { AleaRNG, IRNG } from "../rand";
import { getRing4, getRing8 } from "../fov/get-ring";

export interface DrunkardsWalkConfig {
  width: number;
  height: number;
  rng?: IRNG;
  topology?: "four" | "eight";
}

/** Generator to perform a Drunkard's Walk*/
export class DrunkardsWalk {
  table: Table<number>;

  private _path: Vector2[] = [];
  private _steps: number = 0;
  private _rng: IRNG;
  private _coveredCount: number = 0;
  private _topology: "four" | "eight";

  /**
   * Creates a new DrunkardsWalk Generator
   * @param config - Generator Config
   * @param config.width number - Width of the map
   * @param config.height number - Height of the map
   * @param config.rng IRNG - Optional random number generator
   * @param config.topology "four" | "eight" - Topology to use. Default four.
   */
  constructor(config: DrunkardsWalkConfig) {
    this.table = new Table(config.width, config.height);
    this._rng = config.rng ?? new AleaRNG();
    this._topology = config.topology ?? "four";

    // Initialize Table
    this.table.fill(0);
  }

  /**
   * Returns the path traveled so far.
   */
  getPath(): Vector2[] {
    return this._path;
  }

  /**
   * Returns the last visited location.
   */
  getCurrent(): Vector2 | undefined {
    return this._path[this._path.length - 1];
  }

  /**
   * Returns the total number of steps taken
   */
  getSteps(): number {
    return this._steps;
  }

  /**
   * Returns the total number of unique spaces visited
   */
  getCoveredCount(): number {
    return this._coveredCount;
  }

  /**
   * Adds a point to the drunkards walk,
   * adjusting path, table, and steps as needed.
   * @param point Vector2 - The point to add
   */
  addPoint(point: Vector2) {
    this._steps++;
    if (this.table.get(point) !== 1) {
      this._coveredCount++;
    }
    this.table.set(point, 1);
    this._path.push(point);
  }

  /**
   * Generate a path by walking a number of steps.
   * Can be called multiple times to have the Drunkard 'jump' to a different spot.
   * @param config - The walk configuration
   * @param config.steps number - The number of steps to take.
   * @param config.start Vector2 - The starting position. Default random.
   * @param config.maxCoveredTiles number - Stops walking if the total number of tiles
   * ever covered reaches this limit. Default Infinity.
   */
  walkSteps(config: {
    steps: number;
    start?: Vector2;
    maxCoveredTiles?: number;
  }) {
    // Initialize config
    const maxCoveredTiles = config.maxCoveredTiles ?? Infinity;
    const { steps } = config;

    // Set the initial coordinate
    this.addPoint(config.start ?? this.getRandPoint());

    for (let i = 0; i < steps - 1; i++) {
      // Break if we're over the covered limit
      if (this._coveredCount >= maxCoveredTiles) {
        break;
      }

      const current = this._path[this._path.length - 1];
      const next = this.getRandomNeighbor(current);
      this.addPoint(next);
    }
  }

  private getRandPoint() {
    const x = this._rng.nextInt(0, this.table.width);
    const y = this._rng.nextInt(0, this.table.height);
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
      if (this.table.isInBounds(n)) {
        next = n;
      }
    }
    return next;
  }
}
