import React from "react";

import { Terminal } from "yendor";

export default class extends React.Component {
  componentDidMount() {
    const mountNode = document.getElementById("example");
    const font = new Terminal.Font("Courier", 24, 15, 24, 1, 20);
    const terminal = new Terminal.CanvasTerminal({
      width: 20,
      height: 10,
      font,
      mountNode,
    });
    terminal.clear();
    terminal.writeAt({ x: 0, y: 0 }, "Yendor Says");
    terminal.writeAt({ x: 1, y: 1 }, "Hello World!");
    terminal.render();
  }

  render() {
    return <div id="example" />;
  }
}
