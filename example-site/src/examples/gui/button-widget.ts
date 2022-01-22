import { Terminal, GUI, Color, Input } from "malwoden";
import { IExample } from "../example";

export class ButtonWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any>;
  mainPanel: GUI.Widget<any>;
  mouseContext: Input.MouseContext;
  mouseHandler: Input.MouseHandler;

  selectedColor?: Color;
  selectedColorName = "";

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

    this.mouseContext = new Input.MouseContext();
    this.mouseHandler = new Input.MouseHandler().setContext(this.mouseContext);

    // Create a Container to hold other widgets!
    // Here we pass a mouse handler as well.
    this.gui = new GUI.ContainerWidget()
      .setTerminal(this.terminal)
      .setMouseHandler(this.mouseHandler) // MouseHandler gives general information even when not clicking
      .registerMouseContext(this.mouseContext); // Will listen for mouse clicks

    this.mainPanel = new GUI.PanelWidget({
      origin: { x: 3, y: 3 },
      initialState: {
        width: 40,
        height: 20,
        borderStyle: "double-bar",
        backColor: Color.DimGray,
      },
    }).setParent(this.gui);

    new GUI.TextWidget({
      origin: { x: 1, y: 0 },
      initialState: {
        text: "Buttons! ",
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.TextWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text:
          "Buttons can detect mouse clicks. A few basic styles are supplied.",
        wrapAt: 32,
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.ButtonWidget({
      origin: { x: 2, y: 7 },
      initialState: {
        text: "Blue!",
        backColor: Color.Blue,
        hoverColor: Color.LightBlue,
        downColor: Color.Blue,
        onClick: () => {
          this.selectedColor = Color.Blue;
          this.selectedColorName = "Blue";
        },
      },
    }).setParent(this.mainPanel);

    new GUI.ButtonWidget({
      origin: { x: 2, y: 9 },
      initialState: {
        text: "Green!",
        backColor: Color.Green,
        hoverColor: Color.LightGreen,
        downColor: Color.Green,
        padding: 1,
        onClick: () => {
          this.selectedColor = Color.LightGreen;
          this.selectedColorName = "Green";
        },
      },
    }).setParent(this.mainPanel);

    new GUI.ButtonWidget({
      origin: { x: 2, y: 14 },
      initialState: {
        text: "Red!",
        backColor: Color.Red,
        hoverColor: Color.Pink,
        downColor: Color.Red,
        padding: 1,
        borderStyle: "single-bar",
        onClick: () => {
          this.selectedColor = Color.Red;
          this.selectedColorName = "Red";
        },
      },
    }).setParent(this.mainPanel);

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    this.gui.cascadeUpdate();
    this.gui.cascadeDraw();

    this.terminal.writeAt(
      { x: 20, y: 10 },
      "Pick a color",
      Color.White,
      Color.DimGray
    );

    if (this.selectedColor) {
      this.terminal.writeAt(
        { x: 20, y: 12 },
        "You chose ",
        Color.White,
        Color.DimGray
      );
      this.terminal.writeAt(
        { x: 30, y: 12 },
        this.selectedColorName,
        this.selectedColor,
        Color.DimGray
      );
    }
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
