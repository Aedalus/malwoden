import { Example } from "../example";
import { Terminal, Glyph, CharCode, Input, Color, Generation, Util } from "cacti-term";

export default class extends Example {
  Run() {
    const terminal = Terminal.Retro.fromURL(80, 50, "font_16.png", 16, 16);
    const map = new Generation.DrunkardsWalk(80, 50, 2, 1, 1);

    map.doSimulationStep(10, 20, 3);
    terminal.clear();
    for (let x = 0; x < map.table.width; x++) {
      for (let y = 0; y < map.table.height; y++) {
        if (map.table.get(x, y) === 2) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSpadeSuit,
            fore: Color.green,
          });
        }

        if (map.table.get(x, y) === 1) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSpadeSuit,
            fore: Color.aqua,
          });
        }
      }
    }
  }
}
