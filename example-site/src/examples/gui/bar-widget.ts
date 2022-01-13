import { Terminal, GUI, Color } from "malwoden";
import { IExample } from "../example";

export class BarWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any, BarWidgetExample>;
  mainPanel: GUI.Widget<any, BarWidgetExample>;

  playerHP = 0;
  playerMana = 0;

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

    this.mainPanel = new GUI.PanelWidget<BarWidgetExample>({
      origin: { x: 3, y: 3 },
      initialState: {
        width: 40,
        height: 20,
        borderStyle: "double-bar",
        backColor: Color.DimGray,
      },
    }).setParent(this.gui);

    new GUI.TextWidget<BarWidgetExample>({
      origin: { x: 1, y: 0 },
      initialState: {
        text: " Widgets! ",
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.TextWidget<BarWidgetExample>({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "Bars can help represent hp, time, etc",
        wrapAt: 35,
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.BarWidget<BarWidgetExample>({
      origin: { x: 2, y: 5 },
      initialState: { maxValue: 10, width: 10 },
    })
      .setUpdateFunc((example) => ({
        currentValue: example.playerHP,
      }))
      .setParent(this.mainPanel);

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    // Add a simple animation
    this.playerHP = Math.cos(Date.now() / 2000) * 9 + 1;
    this.playerMana = Math.cos(Date.now() / 2000) * 9 + 1;

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
