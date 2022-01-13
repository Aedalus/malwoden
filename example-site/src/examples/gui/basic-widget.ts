import { Terminal, GUI, Color } from "malwoden";
import { IExample } from "../example";

export class BasicWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any, BasicWidgetExample>;
  mainPanel: GUI.Widget<any, BasicWidgetExample>;

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
    this.gui = new GUI.ContainerWidget({
      initialState: {},
    });

    this.mainPanel = new GUI.PanelWidget<BasicWidgetExample>({
      origin: { x: 3, y: 3 },
      initialState: {
        width: 40,
        height: 20,
        borderStyle: "double-bar",
        backColor: Color.BlueViolet,
      },
    }).setParent(this.gui);

    new GUI.TextWidget<BasicWidgetExample>({
      origin: { x: 1, y: 0 },
      initialState: {
        text: " Widgets! ",
        backColor: Color.BlueViolet,
      },
    }).setParent(this.mainPanel);

    new GUI.TextWidget<BasicWidgetExample>({
      origin: { x: 2, y: 2 },
      initialState: {
        text:
          "Malwoden provides a basic widget framework out of the box. This can help keep elements of your UI together. You can also make custom, reusable components!",
        wrapAt: 35,
        backColor: Color.BlueViolet,
      },
    }).setParent(this.mainPanel);

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    // Add a simple animation
    const curveX = Math.cos(Date.now() / 2000) * 4 + 2;
    const curveY = Math.cos(Date.now() / 2000) * 4 + 2;

    this.mainPanel.setOrigin({
      x: 3 + Math.round(curveX),
      y: 3 + Math.round(curveY),
    });

    this.gui.cascadeUpdate(this);
    this.gui.cascadeDraw(this.terminal);
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
