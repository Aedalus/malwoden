import React, { useEffect } from "react";

import { Terminal } from "malwoden";

const HelloWorld = () => {
  useEffect(() => {
    const mountNode = document.getElementById("example")!;

    const font = new Terminal.Font("Courier New", 24);
    const terminal = new Terminal.CanvasTerminal({
      width: 50,
      height: 20,
      font,
      mountNode,
    });

    terminal.clear();
    terminal.writeAt({ x: 1, y: 1 }, "Hello World!");

    terminal.writeAt(
      { x: 1, y: 4 },
      "Malwoden can also draw a font to a canvas."
    );
    terminal.writeAt({ x: 1, y: 5 }, "This can help if you don't want to use");
    terminal.writeAt({ x: 1, y: 6 }, "a CP437 tileset.");
    terminal.writeAt({ x: 1, y: 18 }, "@_,");

    terminal.render();
  }, []);
  return <div id="example" />;
};

export default HelloWorld;
