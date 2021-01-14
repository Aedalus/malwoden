import React from "react";

import {
  Terminal,
  Util,
  Generation,
  FOV,
  Input,
  CharCode,
  Color,
} from "malwoden";

export default class extends React.Component {
  componentDidMount() {
    const mount = document.getElementById("example");
    const terminal = new Terminal.RetroTerminal({
      width: 40,
      height: 40,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    const explored = new Util.Table<boolean>(40, 40);
    const map = new Generation.CellularAutomata(40, 40);
    map.randomize(0.65);
    map.doSimulationStep(3);
    map.connect();

    const free = [];
    for (let x = 0; x < map.table.width; x++) {
      for (let y = 0; y < map.table.height; y++) {
        if (map.table.get({ x, y }) !== map.aliveValue) {
          free.push({ x, y });
        }
      }
    }
    const player = {
      x: free[0].x,
      y: free[0].y,
    };

    const fov = new FOV.PreciseShadowcasting({
      lightPasses: (pos) => map.table.get(pos) !== 1,
      topology: "eight",
    });

    // Keyboard
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext()
      .onDown(Input.KeyCode.DownArrow, () => attemptMove(0, 1))
      .onDown(Input.KeyCode.LeftArrow, () => attemptMove(-1, 0))
      .onDown(Input.KeyCode.RightArrow, () => attemptMove(1, 0))
      .onDown(Input.KeyCode.UpArrow, () => attemptMove(0, -1));

    keyboard.setContext(movement);

    let fov_spaces: { pos: Util.Vector2; r: number; v: number }[] = [];
    calcFOV();

    function attemptMove(dx: number, dy: number) {
      const x = player.x + dx;
      const y = player.y + dy;
      if (map.table.get({ x, y }) !== 1) {
        player.x = x;
        player.y = y;
        calcFOV();
      }
    }

    function calcFOV() {
      fov_spaces = [];

      fov.calculateCallback(player, 10, (pos, r, v) => {
        if (v) {
          if (explored.isInBounds(pos)) {
            explored.set(pos, true);
          }
          fov_spaces.push({ pos, r, v });
        }
      });
    }

    const loop = () => {
      terminal.clear();

      // Draw all tiles
      for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 50; y++) {
          if (explored.get({ x, y })) {
            const isAlive = map.table.get({ x, y }) === 1;
            if (isAlive) {
              terminal.drawCharCode(
                { x: x, y: y },
                CharCode.blackSpadeSuit,
                Color.DarkGreen.toGrayscale(),
                Color.Green.toGrayscale()
              );
            } else {
              terminal.drawCharCode(
                { x: x, y: y },
                CharCode.fullBlock,
                Color.Green.toGrayscale()
              );
            }
          }
        }
      }

      // Draw tiles in fov
      for (let { pos, v } of fov_spaces) {
        const isAlive = map.table.get(pos) === 1;
        if (isAlive) {
          terminal.drawCharCode(
            pos,
            CharCode.blackSpadeSuit,
            Color.DarkGreen.blend(Color.Black, (1 - v) / 2),
            Color.Green.blend(Color.Black, (1 - v) / 2)
          );
        } else {
          terminal.drawCharCode(
            pos,
            CharCode.fullBlock,
            Color.Green.blend(Color.Black, (1 - v) / 2)
          );
        }
      }

      // Draw player
      terminal.drawCharCode(
        { x: player.x, y: player.y },
        CharCode.at,
        Color.Yellow
      );

      terminal.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    return <div id="example" />;
  }
}
