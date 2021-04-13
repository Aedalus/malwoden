import { getRing4 } from "../fov/get-ring"
import { Vector2, PriorityQueue } from "../util"

/** A Vector2 that includes a range from an origin point */
interface RangeVector {
    /** The x coordinate */
    x: number
    /** The y coordinate */
    y: number
    /** The range */
    r: number
}

interface DistanceFunction {
    (from: Vector2, to: Vector2) : number
}

/** Used to find a range from a central point, like movement or ranged attacks in turn-based games. */
export class RangeFinder {
    private getDistance: DistanceFunction = () => 1
    readonly topology: "four" | "eight"

    /**
     * @param config - Configuration for the RangeFinder
     * @param config.topology - four | eight
     * @param config.getDistance - Override the distance function for terrain costs or blocked spaces.
     */
    constructor(config: {
        getDistance?: DistanceFunction
        topology: "four" | "eight"
    }){
        this.topology = config.topology
        if(config.getDistance){
            this.getDistance = config.getDistance
        }
    }

    private getNeighbors(pos: Vector2): Vector2[] {
        const neighbors = getRing4(pos.x, pos.y, 1);
    
        if (this.topology === "eight") {
          neighbors.push({ x: pos.x + 1, y: pos.y - 1 });
          neighbors.push({ x: pos.x - 1, y: pos.y - 1 });
          neighbors.push({ x: pos.x - 1, y: pos.y + 1 });
          neighbors.push({ x: pos.x + 1, y: pos.y + 1 });
        }
    
        return neighbors;
      }

    /**
     * Find the range from a given point.
     * @param config 
     * @returns - RangeVector[] ({x,y,r}[])
     */
    findRange(config: {
        start: Vector2,
        range: number
        minRange?: number
    }) : RangeVector[] {

        const {start, range, minRange = 0} = config

        // Nodes we will process neighbors of
        const horizon = new PriorityQueue<RangeVector>(v => v.r)
        horizon.insert({...start, r: 0})

        const explored = new Map<string, number>()
        explored.set(`${start.x}:${start.y}`,0)

        const breadcrumbs = new Map<string, string>()

        while(horizon.size()) {
            // Handle current node first
            const current = horizon.pop()!;

            // Handle neighbors
            const neighbors = this.getNeighbors(current)
            for(let n of neighbors){
                const distance = current.r + this.getDistance(current, n)
                const neighbor = {...n, r: distance}

                // See if it's even in range
                if(neighbor.r > range) continue

                // If we've not seen it before, just add it and reprocess neighbors
                if(!explored.has(`${neighbor.x}:${neighbor.y}`)){
                    explored.set(`${neighbor.x}:${neighbor.y}`,neighbor.r)
                } else {
                    const existingDistance = explored.get(`${neighbor.x}:${neighbor.y}`)
                }

                if(explored.has(`${neighbor.x}:${neighbor.y}`)){
                    const ex
                }

                if(explored.has(`${current.v.x}:${current.v.y}`)) continue
                if()
            }
        }
        return []
    }
}
// interface PriorityNode<T> {
//     node: T;
//     distance: number;
//     prev?: PriorityNode<T>; // Use this to store last node info
//   }
  
//   interface ISelectionAnalyzerConfig<T> {
//     initialNode: T;
//     getNeighborNodes: (node: T) => T[];
//     compareNodes: (a: T, b: T) => boolean | number;
//     getEdgeWeight: (neighbor: T, node: T) => number;
//   }
  
//   export class SelectionAnalyzer<T> {
//     initialNode: T;
//     getNeighborNodes: (node: T) => T[];
//     compareNodes: (a: T, b: T) => boolean | number;
//     getEdgeWeight: (neighbor: T, node: T) => number;
  
//     constructor(config: ISelectionAnalyzerConfig<T>) {
//       this.initialNode = config.initialNode;
//       this.getNeighborNodes = config.getNeighborNodes;
//       this.compareNodes = config.compareNodes;
//       this.getEdgeWeight = config.getEdgeWeight;
//     }
  
//     getNeighborData(prev: PriorityNode<T>): PriorityNode<T>[] {
//       return this.getNeighborNodes(prev.node).map(neighbor => ({
//         node: neighbor,
//         distance: prev.distance + this.getEdgeWeight(neighbor, prev.node),
//         prev
//       }));
//     }
  
//     djikstraDistanceSearch({ min = 1, max }: { min?: number; max: number }) {
//       const initData: PriorityNode<T> = {
//         node: this.initialNode,
//         distance: 0
//       };
  
//       const dataCompare = (a: PriorityNode<T>, b: PriorityNode<T>) => {
//         if (a.distance < b.distance) return -1;
//         if (a.distance > b.distance) return 1;
//         return 0;
//       };
//       const frontier = new PriorityQueue([initData], dataCompare);
//       const explored = [initData];
  
//       const isInDistance = (nodeData: PriorityNode<T>) =>
//         nodeData.distance <= max;
//       // This logic doesn't look right...
//       const isExplored = (nodeData: PriorityNode<T>) =>
//         explored.every(x => this.compareNodes(nodeData.node, x.node) === false);
  
//       while (frontier.length > 0) {
//         // Get minimum distance value
//         const nodeData = frontier.pop();
//         const neighborData = this.getNeighborData(nodeData);
  
//         neighborData.forEach(neighbor => {
//           if (isInDistance(neighbor) && isExplored(neighbor)) {
//             frontier.push(neighbor);
//             explored.push(neighbor);
//           }
//         });
//       }
  
//       return explored.filter(x => x.distance >= min);
//     }
  
//     findPath(_start: T, _finish: T) {
//       const start = { ..._start };
//       const finish = { ..._finish };
//       const initData: PriorityNode<T> = {
//         node: start,
//         distance: 0
//       };
  
//       const dataCompare = (a: PriorityNode<T>, b: PriorityNode<T>) => {
//         if (a.distance < b.distance) return -1;
//         if (a.distance > b.distance) return 1;
//         return 0;
//       };
//       const frontier = new PriorityQueue([initData], dataCompare);
//       const explored: PriorityNode<T>[] = [];
  
//       const isFinish = (nodeData: PriorityNode<T>) =>
//         this.compareNodes(nodeData.node, finish);
//       const isExplored = (nodeData: PriorityNode<T>) =>
//         explored.some(x => !!this.compareNodes(nodeData.node, x.node));
  
//       while (frontier.length > 0) {
//         // Get minimum distance value
//         const nodeData = frontier.pop();
//         const neighborData = this.getNeighborData(nodeData);
//         explored.push(nodeData);
  
//         if (isFinish(nodeData)) {
//           const pathToBeginning: PriorityNode<T>[] = [];
//           let current = nodeData;
//           while (current) {
//             pathToBeginning.push(current);
//             current = current.prev;
//           }
//           const pathToEnd = pathToBeginning.reverse();
//           return pathToEnd;
//         } else {
//           for (let neighbor of neighborData) {
//             if (isExplored(neighbor) === false) {
//               frontier.push(neighbor);
//             }
//           }
//         }
//       }
  
//       return [];
//     }
//   }