import { Example } from "../example";
import { Terminal, Glyph, CharCode, Input, Color, Generation, Util } from "cacti-term";

export default class extends Example {
  Run() {
    const terminal = Terminal.Retro.fromURL(80, 50, "font_16.png", 16, 16);
    const map = new Generation.DrunkardsWalk(80, 50);

    map.RunSimulationOnSteps(10, 20, 50);
    console.log("getting historical data.");
    map.getHistoricalData();
    console.log("getting data at step 49");
    map.getHistoricalDataAtStep(49);
    console.log("getting historical data at position 10,20");
    console.log(map.getHistoricalDataAtPosition(20, 10));
    // map.doSimulationStep(30, 40, 10);

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
