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
} from "malwoden";

const RangeFinderExample = () => {
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

    const rangeFinder = new Pathfinding.RangeFinder({
      topology: "eight",
      getDistanceCallback: (_, to) => {
        if (map.table.get(to)) return 10;
        if (sand.table.get(to)) return 2;

        return 1;
      },
    });

    // Mark this as dirty as needed
    let range = rangeFinder.compute({
      start: player,
      maxRange: 5,
      minRange: 1,
    });

    function move(dx: number, dy: number) {
      const x = player.x + dx;
      const y = player.y + dy;
      if (map.table.isInBounds({ x, y }) && map.table.get({ x, y }) === 0) {
        player.x = x;
        player.y = y;
      }

      // Recompute range on move
      // Mark this as dirty as needed
      range = rangeFinder.compute({
        start: player,
        maxRange: 5,
        minRange: 1,
      });
    }

    // Keyboard
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext()
      .onDown(Input.KeyCode.DownArrow, () => move(0, 1))
      .onDown(Input.KeyCode.LeftArrow, () => move(-1, 0))
      .onDown(Input.KeyCode.RightArrow, () => move(1, 0))
      .onDown(Input.KeyCode.UpArrow, () => move(0, -1));

    keyboard.setContext(movement);

    function loop() {
      terminal.clear();

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

      // Draw range
      for (let r of range) {
        terminal.drawCharCode(r, CharCode.asterisk, Color.DarkCyan);
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

export default RangeFinderExample;
