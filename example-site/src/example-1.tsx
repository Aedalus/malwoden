import React from "react";
import { Terminal } from "cacti-term";

export default class Example1 extends React.Component {
  componentDidMount() {
    const font = new Terminal.Font("Courier", 24, 15, 24, 1, 24);
    const terminal = Terminal.Canvas.New(10, 10, font);
    // const terminal = CanvasTerminal.CanvasTerminal(10, 10, new Font("Courier", 24, 15, 24, 1, 22));
    terminal.clear();
    terminal.writeAt({
      x: 1,
      y: 1,
      text: "foo"
    });
    terminal.writeAt({
      x: 0,
      y: 0,
      text: "bar"
    });
    terminal.render();
  }
  render() {
    return <div></div>;
  }
}
