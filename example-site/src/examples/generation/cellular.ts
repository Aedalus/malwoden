import { Terminal, Generation, CharCode, Color, Struct } from "malwoden";
import { IExample } from "../example";

export class CellularAutomataExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  builder: Generation.CellularAutomataBuilder<number>;
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

    this.builder = new Generation.CellularAutomataBuilder({
      width: 50,
      height: 30,
      wallValue: 1,
      floorValue: 0,
    });
    this.builder.randomize(0.6);
    this.builder.doSimulationStep(3);
    this.map = this.builder.getMap();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        const isAlive = this.map.get({ x: x, y: y }) === 1;
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
