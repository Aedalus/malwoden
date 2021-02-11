import React, { useEffect } from "react";

import { Terminal, Glyph, Color, Generation, CharCode } from "malwoden";

export default () => {
  useEffect(() => {
    const mount = document.getElementById("example")!;
    const terminal = new Terminal.RetroTerminal({
      width: 60,
      height: 50,
      imageURL: "/agm_16x16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    // Clear entire terminal
    terminal.clear();

    // Background
    const cell = new Generation.CellularAutomata(
      terminal.width,
      terminal.height
    );
    cell.randomize(0.65);

    for (let x = 3; x < 42; x++) {
      for (let y = 2; y < 20; y++) {
        cell.table.set({ x, y }, 0);
      }
    }
    cell.doSimulationStep(3);
    cell.connect();

    for (let x = 0; x < terminal.width; x++) {
      for (let y = 0; y < terminal.height; y++) {
        if (cell.table.get({ x, y })) {
          terminal.drawGlyph(
            { x, y },
            Glyph.fromCharCode(CharCode.blackSpadeSuit, Color.Green)
          );
        }
      }
    }

    // Forefront
    terminal.writeAt({ x: 10, y: 3 }, "@_,", Color.DarkGoldenrod);

    terminal.writeAt({ x: 4, y: 5 }, "--------");
    terminal.writeAt({ x: 3, y: 6 }, "Malwoden", Color.Goldenrod);
    terminal.writeAt({ x: 2, y: 7 }, "--------");

    terminal.writeAt({ x: 12, y: 6 }, "- A Roguelike Library for JS/TS");

    // Features
    const features = [
      "Open Source",
      "No Dependencies",
      "Font + CP437 Canvas Displays",
      "Pathfinding",
      "Map Generation",
      "Seedable RNG",
      "FOV",
      "Tutorial (Coming Soon)",
    ];

    features.forEach((f, i) => {
      terminal.writeAt({ x: 3, y: 9 + i }, `- ${f}`, Color.Gray);
    });

    const w = terminal.port({ x: 3, y: 20 }, 30, 20);

    terminal.render();
  }, []);
  return (
    <div
      id="background"
      style={{
        backgroundColor: "black",
        width: "100vw",
        // height: "80%",
      }}
    >
      <div id="example" />
    </div>
  );
};
