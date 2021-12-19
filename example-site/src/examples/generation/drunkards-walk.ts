import { Terminal, Generation, CharCode, Color } from "malwoden";
import { IExample } from "../example";

export class DrunkardsWalkExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  map: Generation.DrunkardsWalk;

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

    this.map = new Generation.DrunkardsWalk({
      width: 50,
      height: 30,
    });

    this.map.walkSteps({
      start: { x: 20, y: 20 },
      steps: Infinity,
      maxCoveredTiles: 400,
    });

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    for (let x = 0; x < this.map.table.width; x++) {
      for (let y = 0; y < this.map.table.height; y++) {
        if (this.map.table.get({ x, y }) === 1) {
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
