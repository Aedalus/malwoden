import { Glyph, Terminal } from "malwoden";
import { IExample } from "../example";

export class HelloWorldExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;

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

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    this.terminal.writeAt({ x: 1, y: 1 }, "Hello World!");

    this.terminal.writeAt({ x: 1, y: 5 }, "Malwoden is great");
    this.terminal.writeAt({ x: 1, y: 6 }, "at rendering");
    this.terminal.writeAt({ x: 1, y: 7 }, "CP437 tilesets");

    this.terminal.writeAt({ x: 1, y: 28 }, "@_,");

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const num = x + y * 16;
        this.terminal.drawGlyph(
          { x: x + 26, y: y + 5 },
          Glyph.fromCharCode(num)
        );
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
