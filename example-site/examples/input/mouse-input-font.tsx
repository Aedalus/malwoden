import React from "react";

import { CharCode, Color, Terminal, Input } from "yendor";

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

    const mouse = new Input.MouseHandler();

    function loop() {
      terminal.clear();
      const mousePos = mouse.getPos();
      const char = terminal.pixelToChar(mousePos);
      terminal.drawCharCode(char, CharCode.at, Color.Yellow);
      terminal.render();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  render() {
    return <div id="example"></div>;
  }
}
