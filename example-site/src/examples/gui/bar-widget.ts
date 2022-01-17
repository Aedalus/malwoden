import { Terminal, GUI, Color, Glyph } from "malwoden";
import { IExample } from "../example";

export class BarWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any>;
  mainPanel: GUI.Widget<any>;

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
        text: " Widgets! ",
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.TextWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "Bars can help represent hp, time, etc",
        wrapAt: 25,
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    new GUI.BarWidget({
      origin: { x: 2, y: 5 },
      initialState: { maxValue: 10, width: 10 },
    })
      .setUpdateFunc(() => ({
        currentValue: this.playerHP,
      }))
      .setParent(this.mainPanel);

    new GUI.BarWidget({
      origin: { x: 2, y: 7 },
      initialState: {
        maxValue: 10,
        width: 15,
        foreGlyph: new Glyph(" ", Color.Red, Color.Red),
        backGlyph: new Glyph(" ", Color.DarkRed, Color.DarkRed),
      },
    })
      .setUpdateFunc(() => ({
        currentValue: this.playerHP,
      }))
      .setParent(this.mainPanel);

    new GUI.BarWidget({
      origin: { x: 2, y: 9 },
      initialState: {
        maxValue: 10,
        width: 20,
        foreGlyph: new Glyph("~", Color.Cyan, Color.DarkBlue),
        backGlyph: new Glyph(" ", Color.Cyan, Color.DarkBlue),
      },
    })
      .setUpdateFunc(() => ({
        currentValue: this.playerHP,
      }))
      .setParent(this.mainPanel);

    new GUI.BarWidget({
      origin: { x: 2, y: 11 },
      initialState: {
        maxValue: 10,
        width: 25,
        foreGlyph: new Glyph("*", Color.Yellow, Color.DimGray),
        backGlyph: new Glyph(" ", Color.Cyan, Color.DimGray),
      },
    })
      .setUpdateFunc(() => ({
        currentValue: this.playerHP,
      }))
      .setParent(this.mainPanel);

    new GUI.TextWidget({
      origin: { x: 2, y: 13 },
      initialState: {
        text: "They'll help calculate based on min/max/current values",
        wrapAt: 25,
        backColor: Color.DimGray,
      },
    }).setParent(this.mainPanel);

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    // Add a simple animation
    this.playerHP = Math.abs(Math.sin(Date.now() / 2000) * 10);
    this.playerMana = Math.abs(Math.sin(Date.now() / 2000) * 10);

    this.gui.cascadeUpdate();
    this.gui.cascadeDraw({ terminal: this.terminal });
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
