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
  Util,
} from "malwoden";
import { IExample } from "../example";

export class BasicGameExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  mapTerminal: Terminal.PortTerminal;
  rng = new Rand.AleaRNG();
  openPositions: Vector2[] = [];

  map: Util.Table<number>;
  map_width = 32;
  map_height = 20;

  logs: string[] = [];
  player: { x: number; y: number; coins: number; hp: number };
  coin: Vector2;

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
    this.mapTerminal = this.terminal.port(
      { x: 17, y: 1 },
      this.map_width,
      this.map_height
    );

    // Generate Map
    const gen = new Generation.CellularAutomata<number>(
      this.map_width,
      this.map_height
    );
    gen.randomize(0.7);
    gen.doSimulationStep();
    this.map = gen.table;

    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if (this.map.get({ x, y }) === 0) this.openPositions.push({ x, y });
      }
    }

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

    // Player Box
    GUI.box(this.terminal, {
      title: "Player",
      origin: { x: 0, y: 0 },
      width: 15,
      height: 21,
    });

    // HP
    this.terminal.writeAt(
      { x: 2, y: 2 },
      `HP : ${this.player.hp}/10`,
      Color.Red
    );
    this.terminal.writeAt(
      { x: 2, y: 4 },
      `Gold : ${this.player.coins}`,
      Color.Yellow
    );

    // World Box
    GUI.box(this.terminal, {
      origin: { x: 16, y: 0 },
      width: 33,
      height: 21,
    });

    // Logs
    GUI.box(this.terminal, {
      title: "Log",
      origin: { x: 0, y: 22 },
      width: 49,
      height: 7,
    });
    for (let i = 0; i < this.logs.length; i++) {
      this.terminal.writeAt({ x: 1, y: 23 + i }, this.logs[i]);
    }

    // Draw Map
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        const isWall = this.map.get({ x, y });
        this.mapTerminal.drawCharCode(
          { x, y },
          isWall ? CharCode.blackSpadeSuit : CharCode.space,
          isWall ? Color.Green : Color.White
        );
      }
    }

    // Coin
    this.mapTerminal.drawGlyph(
      this.coin,
      Glyph.fromCharCode(CharCode.oLower, Color.Yellow)
    );
    // Player Entity
    this.mapTerminal.drawGlyph(
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
