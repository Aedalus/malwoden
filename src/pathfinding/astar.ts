import { type } from "os";
import { Vector2 } from "../util";

type heuristicFunction = (pos: Vector2) => number;

function AStar(current: Vector2, goal: Vector2, heuristic: heuristicFunction) {}
