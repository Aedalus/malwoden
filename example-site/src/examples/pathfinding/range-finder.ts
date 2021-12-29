import {
  CharCode,
  Color,
  Terminal,
  Input,
  Generation,
  Util,
  Rand,
  Pathfinding,
  Vector2,
} from "malwoden";
import { IExample } from "../example";

export class RangeFinderExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  map: Util.Table<number>;
  sandMap: Util.Table<number>;
  player: Vector2;
  rangeFinder: Pathfinding.RangeFinder;

  width = 50;
  height = 30;

  range: Pathfinding.RangeVector2[];

  constructor() {
    this.mount = document.getElementById("example")!;
    this.terminal = new Terminal.RetroTerminal({
      width: this.width,
      height: this.height,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: this.mount,
    });

    const gen = new Generation.CellularAutomata<number>(
      this.width,
      this.height
    );
    gen.randomize();
    gen.doSimulationStep(4);
    gen.connect();
    this.map = gen.table;

    const sandGen = new Generation.CellularAutomata<number>(
      this.width,
      this.height,
      {
        rng: new Rand.AleaRNG("foo"),
      }
    );
    sandGen.randomize(0.65);
    sandGen.doSimulationStep(6);
    this.sandMap = sandGen.table;

    // Get a random free spot
    const freeSpots: Util.Vector2[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const wall = this.map.get({ x, y });
        if (!wall) freeSpots.push({ x, y });
      }
    }

    this.player = new Rand.AleaRNG().nextItem(freeSpots)!;

    this.rangeFinder = new Pathfinding.RangeFinder({
      topology: "eight",
      getTerrainCallback: (_, to) => {
        if (this.map.get(to)) return 10;
        if (this.sandMap.get(to)) return 2;

        return 1;
      },
    });

    this.range = this.rangeFinder.compute({
      start: this.player,
      maxRange: 5,
      minRange: 1,
    });

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

  move(dx: number, dy: number) {
    const x = this.player.x + dx;
    const y = this.player.y + dy;
    if (this.map.isInBounds({ x, y }) && this.map.get({ x, y }) === 0) {
      this.player.x = x;
      this.player.y = y;
    }

    // Recompute range on move
    // Mark this as dirty as needed
    this.range = this.rangeFinder.compute({
      start: this.player,
      maxRange: 5,
      minRange: 1,
    });
  }

  loop() {
    this.terminal.clear();

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const isSand = this.sandMap.get({ x, y });
        let background = isSand
          ? Color.DarkOliveGreen.blend(Color.Black, 0.6)
          : undefined;
        const isWall = this.map.get({ x, y });
        let foreground = isWall ? Color.Green : Color.Black;
        let charcode = isWall ? CharCode.blackClubSuit : CharCode.blackSquare;

        this.terminal.drawCharCode({ x, y }, charcode, foreground, background);
      }
    }

    // Draw range
    for (let r of this.range) {
      this.terminal.drawCharCode(r, CharCode.asterisk, Color.DarkCyan);
    }

    // Draw Player
    this.terminal.drawCharCode(this.player, CharCode.at, Color.Yellow);

    // Render Terminal
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
