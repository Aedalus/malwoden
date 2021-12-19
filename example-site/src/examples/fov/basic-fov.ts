import { IExample } from "../example";
import {
  Terminal,
  Util,
  Generation,
  FOV,
  Input,
  CharCode,
  Color,
  Vector2,
} from "malwoden";

export class BasicFoVExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  fov: FOV.PreciseShadowcasting;
  player: Vector2;
  explored: Util.Table<boolean>;
  fov_spaces: { pos: Util.Vector2; r: number; v: number }[] = [];
  map: Util.Table<number>;

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

    this.explored = new Util.Table<boolean>(50, 30);
    const gen = new Generation.CellularAutomata<number>(50, 30);
    gen.randomize(0.65);
    gen.doSimulationStep(3);
    gen.connect();
    this.map = gen.table;

    const free = [];
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if (this.map.get({ x, y }) !== gen.aliveValue) {
          free.push({ x, y });
        }
      }
    }

    this.player = {
      x: free[0].x,
      y: free[0].y,
    };

    this.fov = new FOV.PreciseShadowcasting({
      lightPasses: (pos) => this.map.get(pos) !== 1,
      topology: "eight",
      cartesianRange: true,
    });

    // Keyboard
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext()
      .onDown(Input.KeyCode.DownArrow, () => this.attemptMove(0, 1))
      .onDown(Input.KeyCode.LeftArrow, () => this.attemptMove(-1, 0))
      .onDown(Input.KeyCode.RightArrow, () => this.attemptMove(1, 0))
      .onDown(Input.KeyCode.UpArrow, () => this.attemptMove(0, -1));

    keyboard.setContext(movement);

    this.calcFOV();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  calcFOV() {
    this.fov_spaces = [];

    this.fov.calculateCallback(this.player, 9.9, (pos, r, v) => {
      if (v) {
        if (this.explored.isInBounds(pos)) {
          this.explored.set(pos, true);
        }
        this.fov_spaces.push({ pos, r, v });
      }
    });
  }

  attemptMove(dx: number, dy: number) {
    const x = this.player.x + dx;
    const y = this.player.y + dy;
    if (this.map.get({ x, y }) !== 1) {
      this.player.x = x;
      this.player.y = y;
      this.calcFOV();
    }
  }

  loop() {
    this.terminal.clear();

    // Draw all tiles
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        if (this.explored.get({ x, y })) {
          const isAlive = this.map.get({ x, y }) === 1;
          if (isAlive) {
            this.terminal.drawCharCode(
              { x: x, y: y },
              CharCode.blackSpadeSuit,
              Color.DarkGreen.toGrayscale(),
              Color.Green.toGrayscale()
            );
          } else {
            this.terminal.drawCharCode(
              { x: x, y: y },
              CharCode.fullBlock,
              Color.Green.toGrayscale()
            );
          }
        }
      }
    }

    // Draw tiles in fov
    for (let { pos, v } of this.fov_spaces) {
      const isAlive = this.map.get(pos) === 1;
      if (isAlive) {
        this.terminal.drawCharCode(
          pos,
          CharCode.blackSpadeSuit,
          Color.DarkGreen.blend(Color.Black, (1 - v) / 2),
          Color.Green.blend(Color.Black, (1 - v) / 2)
        );
      } else {
        this.terminal.drawCharCode(
          pos,
          CharCode.fullBlock,
          Color.Green.blend(Color.Black, (1 - v) / 2)
        );
      }
    }

    // Draw player
    this.terminal.drawCharCode(this.player, CharCode.at, Color.Yellow);

    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}

export default BasicFoVExample;
