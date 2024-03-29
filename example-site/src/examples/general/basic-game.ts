import {
  Glyph,
  Terminal,
  Input,
  Color,
  CharCode,
  Generation,
  GUI,
  Rand,
  Vector2,
  Struct,
} from "malwoden";
import { IExample } from "../example";

export class BasicGameExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  mapWidget: GUI.Widget<any>;
  rng = new Rand.AleaRNG();
  openPositions: Vector2[] = [];

  map: Struct.Table<number>;
  map_width = 32;
  map_height = 20;

  logs: string[] = [];
  player: { x: number; y: number; coins: number; hp: number };
  coin: Vector2;

  gui: GUI.Widget<any>;

  constructor() {
    this.mount = document.getElementById("example")!;
    this.terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 30,
      imageURL: "/agm_16x16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: this.mount,
    });

    // Generate Map
    const gen = new Generation.CellularAutomataBuilder<number>({
      width: this.map_width,
      height: this.map_height,
      wallValue: 1,
      floorValue: 0,
    });
    gen.randomize(0.7);
    gen.doSimulationStep();
    this.map = gen.getMap();
    this.openPositions = this.map.filter((_, val) => val === 0);

    const rng = new Rand.AleaRNG();
    const start = rng.nextItem(this.openPositions)!;
    const coinPos = rng.nextItem(this.openPositions)!;

    this.addLog("Collect Coins!");

    // Entities
    this.player = {
      x: start.x,
      y: start.y,
      hp: 10,
      coins: 0,
    };

    this.coin = {
      x: coinPos.x,
      y: coinPos.y,
    };

    // Keyboard
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext()
      .onDown(Input.KeyCode.DownArrow, () => this.move(0, 1))
      .onDown(Input.KeyCode.LeftArrow, () => this.move(-1, 0))
      .onDown(Input.KeyCode.RightArrow, () => this.move(1, 0))
      .onDown(Input.KeyCode.UpArrow, () => this.move(0, -1));

    keyboard.setContext(movement);

    // Create a new container for the UI, set the terminal at the root of the GUI
    this.gui = new GUI.ContainerWidget().setTerminal(this.terminal);

    new GUI.PanelWidget({
      initialState: {
        width: 16,
        height: 22,
        borderStyle: "double-bar",
      },
    }).setParent(this.gui);

    // Create a widget for our map
    // We can use this to draw relative
    this.mapWidget = new GUI.ContainerWidget({
      origin: { x: 17, y: 1 },
    }).setParent(this.gui);

    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: {
        text: " Player ",
      },
    }).setParent(this.gui);

    new GUI.TextWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: `HP: ${this.player.hp}/10`,
        foreColor: Color.Red,
      },
    })
      .setUpdateFunc(() => ({
        text: `HP: ${this.player.hp}/10`,
      }))
      .setParent(this.gui);

    new GUI.TextWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: `Gold : ${this.player.coins}`,
        foreColor: Color.Yellow,
      },
    })
      .setUpdateFunc(() => ({
        text: `Gold : ${this.player.coins}`,
      }))
      .setParent(this.gui);

    new GUI.PanelWidget({
      origin: { x: 16, y: 0 },
      initialState: {
        width: 34,
        height: 22,
        borderStyle: "double-bar",
      },
    }).setParent(this.gui);

    new GUI.PanelWidget({
      origin: { x: 0, y: 22 },
      initialState: {
        width: 50,
        height: 8,
        borderStyle: "double-bar",
      },
    }).setParent(this.gui);

    // Start the game!
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  addLog(txt: string) {
    this.logs.push(txt);
    while (this.logs.length > 5) this.logs.shift();
  }

  collectCoin() {
    this.player.coins++;
    const newPos = this.rng.nextItem(this.openPositions)!;
    this.coin.x = newPos.x;
    this.coin.y = newPos.y;
    this.addLog("Coin!");
  }

  move(dx: number, dy: number) {
    const x = this.player.x + dx;
    const y = this.player.y + dy;
    if (this.map.isInBounds({ x, y }) && this.map.get({ x, y }) === 0) {
      this.player.x = x;
      this.player.y = y;
    }
  }

  loop() {
    // Logic
    if (this.player.x === this.coin.x && this.player.y === this.coin.y) {
      this.collectCoin();
    }

    // Rendering
    this.terminal.clear();

    // Draw common elements
    this.gui.cascadeUpdate();
    this.gui.cascadeDraw();

    // Logs
    for (let i = 0; i < this.logs.length; i++) {
      this.terminal.writeAt({ x: 1, y: 23 + i }, this.logs[i]);
    }

    // Draw Map
    const wallGlyph = Glyph.fromCharCode(CharCode.blackSpadeSuit, Color.Green);
    const spaceGlyph = Glyph.fromCharCode(CharCode.space, Color.White);

    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        const isWall = this.map.get({ x, y });
        this.mapWidget.drawGlyph({ x, y }, isWall ? wallGlyph : spaceGlyph);
      }
    }

    // Coin
    this.mapWidget.drawGlyph(
      this.coin,
      Glyph.fromCharCode(CharCode.oLower, Color.Yellow)
    );
    // Player Entity
    this.mapWidget.drawGlyph(
      this.player,
      Glyph.fromCharCode(CharCode.at, Color.Yellow)
    );

    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
