import { Terminal, Generation, CharCode, Color } from "malwoden";
import { IExample } from "../example";

export class CellularAutomataExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  map: Generation.CellularAutomata<number>;

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

    this.map = new Generation.CellularAutomata<number>(50, 30);
    this.map.randomize(0.6);
    this.map.doSimulationStep(3);

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        const isAlive = this.map.table.get({ x: x, y: y }) === 1;
        if (isAlive) {
          this.terminal.drawCharCode(
            { x, y },
            CharCode.blackSpadeSuit,
            Color.Green
          );
        }
      }
    }
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
