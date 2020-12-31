import { Vector2 } from "./vector";

export interface DijkstraConfig {
  initial: Vector2;
  goal: Vector2;
  table: any; // will be turned into an expected table.
}
