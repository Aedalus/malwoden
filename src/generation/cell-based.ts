// import { Rect } from "../util/rect";

// interface CellBasedOptions {
//   minRooms: number;
//   maxRooms: number;

//   width: number;
//   height: number;

//   cellWidth: number;
//   cellHeight: number;
// }

// export class CellBased {
//   readonly width: number;
//   readonly height: number;

//   private minRooms: number;
//   private maxRooms: number;

//   readonly cellWidth: number;
//   readonly cellHeight: number;

//   // readonly cells: Rect;

//   constructor(options: Partial<CellBasedOptions>) {
//     this.width = options.width !== undefined ? options.width : 80;
//     this.height = options.height !== undefined ? options.height : 50;

//     this.minRooms = options.minRooms !== undefined ? options.minRooms : 5;
//     this.maxRooms = options.maxRooms !== undefined ? options.maxRooms : 10;

//     this.cellWidth = options.cellWidth !== undefined ? options.cellWidth : 5;
//     this.cellHeight = options.cellHeight !== undefined ? options.cellHeight : 5;

//     // Create the cells
//     for (let x = 0; x < this.width / this.cellWidth; x++) {}
//   }
// }
