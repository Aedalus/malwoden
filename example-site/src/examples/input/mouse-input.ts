import { CharCode, Color, Terminal, Input } from "malwoden";
import { IExample } from "../example";

export class MouseInputExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  clickMessage = "Try Clicking!";
  mouse: Input.MouseHandler;

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

    this.mouse = new Input.MouseHandler();
    const c = new Input.MouseContext()
      .onMouseDown((pos) => {
        const termPos = this.terminal.pixelToChar(pos);
        this.clickMessage = `mousedown on ${termPos.x}, ${termPos.y}`;
      })
      .onMouseUp((pos) => {
        const termPos = this.terminal.pixelToChar(pos);
        this.clickMessage = `mouseup on ${termPos.x}, ${termPos.y}`;
      });
    this.mouse.setContext(c);

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();
    // Draw mouse position
    const mousePos = this.mouse.getPos();
    const char = this.terminal.pixelToChar(mousePos);
    this.terminal.drawCharCode(char, CharCode.at, Color.Yellow);

    // Draw mouse message
    this.terminal.writeAt({ x: 0, y: 0 }, this.clickMessage);

    // Render
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
