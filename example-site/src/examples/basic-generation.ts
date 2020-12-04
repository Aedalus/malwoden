import { Example } from "../example";
import { Terminal, Glyph, CharCode, Input, Color, Generation, Util } from "cacti-term";

export default class extends Example {
  Run() {
    const terminal = Terminal.Retro.fromURL(80, 50, "font_16.png", 16, 16);
    const map = new Generation.CellularAutomata(80, 50);
    map.randomize();
    map.doSimulationStep(3);

    terminal.clear();
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        const isAlive = map.table.get(x, y) === 1;
        if (isAlive) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSpadeSuit,
            fore: Math.random() > 0.5 ? Color.green : Color.darkGreen,
          });
        }
      }
    }
    terminal.render();
  }
}
