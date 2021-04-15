import React, { useEffect } from "react";

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

    const mouse = new Input.MouseHandler();
    const map = new Generation.CellularAutomata(width, height);
    map.randomize();
    map.doSimulationStep(4);
    map.connect();

    const sand = new Generation.CellularAutomata(width, height, {
      rng: new Rand.AleaRNG("foo"),
    });
    sand.randomize(0.65);
    sand.doSimulationStep(6);

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
      getTerrainCallback: (_, to) => (sand.table.get(to) ? 4 : 0.5),
      topology: "eight",
    });

    // Get path only when the mouse moves tiles
    let path = dijkstra.compute(player, { x: 0, y: 0 });
    let prevMouse = { x: 0, y: 0 };
    function updatePath(newMouse: Vector2) {
      if (prevMouse.x === newMouse.x && prevMouse.y === newMouse.y) return;
      else {
        path = dijkstra.compute(player, newMouse);
        prevMouse = newMouse;
      }
    }

    function loop() {
      terminal.clear();

      // Draw Map
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const isSand = sand.table.get({ x, y });
          let background = isSand
            ? Color.DarkOliveGreen.blend(Color.Black, 0.6)
            : undefined;
          const isWall = map.table.get({ x, y });
          let foreground = isWall ? Color.Green : Color.Black;
          let charcode = isWall ? CharCode.blackClubSuit : CharCode.blackSquare;

          terminal.drawCharCode({ x, y }, charcode, foreground, background);
        }
      }

      // Draw Mouse
      const mousePos = mouse.getPos();
      const tilePos = terminal.pixelToChar(mousePos);
      terminal.drawCharCode(tilePos, CharCode.asterisk, Color.Cyan);

      updatePath(tilePos);
      for (let p of path ?? []) {
        terminal.drawCharCode(p, CharCode.asterisk, Color.DarkCyan);
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
