import React from "react";

import { Terminal, Generation, CharCode, Color } from "malwoden";

const Cellular = () => {
  React.useEffect(() => {
    const mount = document.getElementById("example");
    const terminal = new Terminal.RetroTerminal({
      width: 40,
      height: 40,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    const map = new Generation.CellularAutomata(40, 40);
    map.randomize(0.6);
    map.doSimulationStep(3);

    terminal.clear();
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        const isAlive = map.table.get({ x: x, y: y }) === 1;
        if (isAlive) {
          const color = Math.random() > 0.5 ? Color.Green : Color.DarkGreen;
          terminal.drawCharCode({ x, y }, CharCode.blackSpadeSuit, color);
        }
      }
    }
    terminal.render();
  }, []);
  return <div id="example" />;
};

export default Cellular;
