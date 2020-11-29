import { Example } from "../example";
import { Terminal } from "cacti-term";

export default class extends Example {
  Run() {
    const font = new Terminal.Font("Courier", 24, 15, 24, 1, 24);
    const terminal = Terminal.Canvas.New(10, 10, font);
    terminal.clear();
    terminal.writeAt({
      x: 1,
      y: 1,
      text: "foo",
    });
    terminal.writeAt({
      x: 0,
      y: 0,
      text: "bar",
    });
    terminal.render();
  }
}
