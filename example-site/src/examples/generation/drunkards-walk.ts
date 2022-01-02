import { Terminal, Generation, CharCode, Color, Struct } from "malwoden";
import { IExample } from "../example";

export class DrunkardsWalkExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  builder: Generation.DrunkardsWalkBuilder<number>;
  map: Struct.Table<number>;

  constructor() {
    this.mount = document.getElementById("example")!;
    this.terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 30,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: this.mount,
    });

    this.builder = new Generation.DrunkardsWalkBuilder({
      width: 50,
      height: 30,
      floorTile: 0,
      wallTile: 1,
    });

    this.builder.walk({
      pathCount: 10,
      start: { x: 20, y: 20 },
      stepsMin: 10,
      stepsMax: 200,
      maxCoverage: 0.6,
    });
    this.map = this.builder.getMap();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if (this.map.get({ x, y }) === 0) {
          this.terminal.drawCharCode(
            { x, y },
            CharCode.blackSquare,
            undefined,
            Color.RosyBrown
          );
        } else {
          this.terminal.drawCharCode(
            { x, y },
            CharCode.blackUpPointingTriangle,
            Color.SaddleBrown,
            Color.RosyBrown
          );
        }
      }
    }

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
