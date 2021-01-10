import React from "react";

import { CharCode, Color, Terminal, Input } from "yendor";

export default class extends React.Component {
  componentDidMount() {
    const mount = document.getElementById("example");
    const width = 48;
    const height = 30;
    const terminal = new Terminal.RetroTerminal({
      width,
      height,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    // ToDo
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
