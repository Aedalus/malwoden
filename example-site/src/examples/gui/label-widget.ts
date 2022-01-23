import { Terminal, GUI, Input, Color } from "malwoden";
import { MouseHandler } from "../../../../dist/types/input";
import { IExample } from "../example";

export class LabelWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any>;
  labelWidget: GUI.LabelWidget;

  mouse: MouseHandler;

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

    // Create a Container to hold other widgets!
    // Set a terminal at the root of the widgets.
    this.gui = new GUI.ContainerWidget().setTerminal(this.terminal);

    this.gui.addChild(
      new GUI.TextWidget({
        origin: { x: 23, y: 15 },
        initialState: {
          text: "Hover!",
        },
      })
    );

    this.labelWidget = new GUI.LabelWidget({
      initialState: {
        text: "Hello!",
        direction: "right",
        backColor: Color.Purple,
      },
    }).setParent(this.gui);

    this.mouse = new Input.MouseHandler();

    this.labelWidget.setUpdateFunc(() => {
      const m = this.mouse.getPos();
      const p = this.terminal.windowToTilePoint(m);
      this.labelWidget.setOrigin(p);

      return {
        text: `(${p.x},${p.y})`,
        direction: p.x < this.terminal.width / 2 ? "right" : "left",
      };
    });

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    this.gui.cascadeUpdate();
    this.gui.cascadeDraw();
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
