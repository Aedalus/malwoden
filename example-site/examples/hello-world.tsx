import React, { useEffect } from "react";

import { Terminal } from "malwoden";

const HelloWorld = () => {
  useEffect(() => {
    const mountNode = document.getElementById("example");
    const font = new Terminal.Font("Courier", 24, 15, 24, 1, 20);
    const terminal = new Terminal.CanvasTerminal({
      width: 20,
      height: 10,
      font,
      mountNode,
    });
    terminal.clear();
    terminal.writeAt({ x: 0, y: 0 }, "Malwoden Says");
    terminal.writeAt({ x: 1, y: 1 }, "Hello World!");
    terminal.render();
  }, []);
  return <div id="example" />;
};

export default HelloWorld;
