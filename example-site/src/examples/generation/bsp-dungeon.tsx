import React, { useEffect } from "react";

import { Terminal, Generation, CharCode, Color, Rand } from "malwoden";

const BSPDungeon = () => {
  useEffect(() => {
    const mount = document.getElementById("example")!;
    const terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 40,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    const seed = Date.now().toString();
    const rng = new Rand.AleaRNG(seed);
    const dungeon = new Generation.BSPDungeon(50, 40, { rng })
      .split({ depth: 3 })
      .createRooms({
        minWidth: 3,
        minHeight: 3,
      })
      .createSimpleHallways();

    const nodes = dungeon.getLeafNodes();
    const map = dungeon.getMapTable(true);

    // Draw all the nodes as colored, just for example
    for (let area of nodes) {
      const color = new Color(
        rng.nextInt(50, 150),
        rng.nextInt(50, 150),
        rng.nextInt(50, 150)
      );

      for (let x = area.v1.x; x < area.v2.x; x++) {
        for (let y = area.v1.y; y < area.v2.y; y++) {
          terminal.drawCharCode({ x, y }, CharCode.blackSpadeSuit, color);
        }
      }
    }

    // Use the map for collisions. Here we can carve out the rooms
    // from the general areas.
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.width; y++) {
        if (!map.get({ x, y })) {
          terminal.drawCharCode({ x, y }, CharCode.space, Color.Black);
        }
      }
    }

    for (let hallway of dungeon.getHallways()) {
      for (let step of hallway) {
        terminal.drawCharCode(step, CharCode.period, Color.DarkGray);
      }
    }
  }, []);
  return <div id="example" />;
};

export default BSPDungeon;
