import React from "react";
import { Terminal, Generation, CharCode, Color } from "malwoden";

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

    const map = new Generation.DrunkardsWalk({
      height: 40,
      width: 40,
    });

    map.walkSteps({
      start: { x: 20, y: 20 },
      steps: Infinity,
      maxCoveredTiles: 400,
    });

    terminal.clear();
    for (let x = 0; x < map.table.width; x++) {
      for (let y = 0; y < map.table.height; y++) {
        if (map.table.get({ x, y }) === 1) {
          terminal.drawCharCode(
            { x, y },
            CharCode.blackSquare,
            undefined,
            Color.RosyBrown
          );
        } else {
          terminal.drawCharCode(
            { x, y },
            CharCode.blackUpPointingTriangle,
            Color.SaddleBrown,
            Color.RosyBrown
          );
        }
      }
    }
  }
  render() {
    return <div id="example" />;
  }
}
