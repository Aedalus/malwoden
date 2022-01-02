import { Terminal, Generation, CharCode, Color, Rand, Struct } from "malwoden";
import { BSPDungeonNode } from "../../../../dist/types/generation";

import { IExample } from "../example";

export class BSPDungeonExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  builder: Generation.BSPDungeonBuilder<number>;
  rng = new Rand.AleaRNG(Date.now().toString());
  colors: Color[];
  map: Struct.Table<number>;
  nodes: BSPDungeonNode[];

  constructor() {
    console.log("foo");
    this.mount = document.getElementById("example")!;
    this.terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 40,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: this.mount,
    });

    this.builder = new Generation.BSPDungeonBuilder({
      width: 50,
      height: 40,
      wallTile: 1,
      floorTile: 0,
    });

    this.builder.splitByCount(4);
    this.builder.createRooms({ minWidth: 3, minHeight: 3, padding: 1 });
    this.builder.createSimpleHallways();
    this.nodes = this.builder.getLeafNodes();
    console.log(this.nodes);
    this.map = this.builder.getMap();

    this.colors = this.builder
      .getLeafNodes()
      .map(
        (_) =>
          new Color(
            this.rng.nextInt(50, 150),
            this.rng.nextInt(50, 150),
            this.rng.nextInt(50, 150)
          )
      );

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    // Draw all the nodes as colored, just for example
    for (let i = 0; i < this.nodes.length; i++) {
      const area = this.nodes[i];
      const areaColor = this.colors[i];

      for (let x = area.v1.x; x <= area.v2.x; x++) {
        for (let y = area.v1.y; y <= area.v2.y; y++) {
          this.terminal.drawCharCode(
            { x, y },
            CharCode.blackSpadeSuit,
            areaColor
          );
        }
      }
    }

    // Use the map for collisions. Here we can carve out the rooms
    // from the general areas.
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.width; y++) {
        if (!this.map.get({ x, y })) {
          this.terminal.drawCharCode({ x, y }, CharCode.space, Color.Black);
        }
      }
    }

    for (let hallway of this.builder.getHallways()) {
      for (let step of hallway) {
        this.terminal.drawCharCode(step, CharCode.period, Color.DarkGray);
      }
    }

    this.terminal.render();
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}
