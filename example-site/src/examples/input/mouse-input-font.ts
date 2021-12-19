import { CharCode, Color, Terminal, Input } from "malwoden";
import { IExample } from "../example";

export class MouseInputFontExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.CanvasTerminal;
  clickMessage = "Try Clicking!";
  mouse: Input.MouseHandler;

  constructor() {
    this.mount = document.getElementById("example")!;
    const font = new Terminal.Font("Courier New", 24);
    this.terminal = new Terminal.CanvasTerminal({
      width: 50,
      height: 20,
      font,
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
