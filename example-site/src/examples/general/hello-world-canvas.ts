import { Terminal } from "malwoden";
import { IExample } from "../example";

export class HelloWorldCanvasExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.CanvasTerminal;

  constructor() {
    this.mount = document.getElementById("example")!;
    const font = new Terminal.Font("Courier New", 24);
    this.terminal = new Terminal.CanvasTerminal({
      width: 50,
      height: 20,
      font,
      mountNode: this.mount,
    });

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    this.terminal.writeAt({ x: 1, y: 1 }, "Hello World!");

    this.terminal.writeAt(
      { x: 1, y: 4 },
      "Malwoden can also draw a font to a canvas."
    );
    this.terminal.writeAt(
      { x: 1, y: 5 },
      "This can help if you don't want to use"
    );
    this.terminal.writeAt({ x: 1, y: 6 }, "a CP437 tileset.");
    this.terminal.writeAt({ x: 1, y: 18 }, "@_,");

    this.terminal.render();
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
