import React, { useEffect } from "react";

import {
  CharCode,
  Color,
  Terminal,
  Input,
  Generation,
  Glyph,
  Util,
  Rand,
  Pathfinding,
} from "malwoden";

const DijkstraExample = () => {
  const requestRef = React.useRef<number>(NaN);

  useEffect(() => {
    const mount = document.getElementById("example")!;
    const width = 48;
    const height = 30;
    const terminal = new Terminal.RetroTerminal({
      width,
      height,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    // ToDo
    const mouse = new Input.MouseHandler();
    const map = new Generation.CellularAutomata(width, height);
    map.randomize();
    map.doSimulationStep(4);
    map.connect();

    // Get a random free spot
    const freeSpots: Util.Vector2[] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const wall = map.table.get({ x, y });
        if (!wall) freeSpots.push({ x, y });
      }
    }

    const player = new Rand.AleaRNG().nextItem(freeSpots)!;

    const dijkstra = new Pathfinding.Dijkstra({
      isBlockedCallback: (pos) => map.table.get(pos) !== 0,
      topology: "eight",
    });

    function loop() {
      terminal.clear();

      // Draw Map
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const wall = map.table.get({ x, y });
          if (wall)
            terminal.drawGlyph(
              { x, y },
              Glyph.fromCharCode(CharCode.blackClubSuit, Color.Green)
            );
        }
      }

      // Draw Mouse
      const mousePos = mouse.getPos();
      const tilePos = terminal.pixelToChar(mousePos);
      terminal.drawCharCode(tilePos, CharCode.asterisk, Color.Cyan);

      // Get path
      const path = dijkstra.compute(player, tilePos);
      if (path) {
        for (let p of path) {
          terminal.drawCharCode(p, CharCode.asterisk, Color.DarkCyan);
        }
      }

      // Draw Player
      terminal.drawCharCode(player, CharCode.at, Color.Yellow);

      // Render Terminal
      terminal.render();
      requestRef.current = requestAnimationFrame(loop);
    }
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  return <div id="example"></div>;
};

export default DijkstraExample;
