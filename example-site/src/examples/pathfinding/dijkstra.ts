import { IExample } from "../example";
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

export class DijkstraExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  mouse: Input.MouseHandler;
  map: Util.Table<number>;
  sandMap: Util.Table<number>;
  player: Vector2;
  dijkstra: Pathfinding.Dijkstra;
  prevMouse = { x: 0, y: 0 };
  path: Util.Vector2[] | undefined;

  width = 50;
  height = 30;

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

    this.mouse = new Input.MouseHandler();
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
    this.dijkstra = new Pathfinding.Dijkstra({
      isBlockedCallback: (pos) => this.map.get(pos) !== 0,
      getTerrainCallback: (_, to) => (this.sandMap.get(to) ? 4 : 0.5),
      topology: "eight",
    });

    // Get path only when the mouse moves tiles
    this.path = this.dijkstra.compute(this.player, { x: 0, y: 0 });

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  updatePath(newMouse: Vector2) {
    if (this.prevMouse.x === newMouse.x && this.prevMouse.y === newMouse.y)
      return;
    else {
      this.path = this.dijkstra.compute(this.player, newMouse);
      this.prevMouse = newMouse;
    }
  }

  loop() {
    this.terminal.clear();

    // Draw Map
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

    // Draw Mouse
    const mousePos = this.mouse.getPos();
    const tilePos = this.terminal.pixelToChar(mousePos);
    this.terminal.drawCharCode(tilePos, CharCode.asterisk, Color.Cyan);

    this.updatePath(tilePos);
    for (let p of this.path ?? []) {
      this.terminal.drawCharCode(p, CharCode.asterisk, Color.DarkCyan);
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
