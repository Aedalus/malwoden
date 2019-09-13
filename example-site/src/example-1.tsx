import React from "react";
import { Font, CanvasTerminal } from "cacti-term";

export default class Example1 extends React.Component {
  componentDidMount() {
    const terminal = CanvasTerminal.CanvasTerminal(10, 10, new Font("Courier", 24, 15, 24, 1, 24));
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
