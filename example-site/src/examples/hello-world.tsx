import React, { useEffect } from "react";

import { Glyph, Terminal } from "malwoden";

const HelloWorld = () => {
  useEffect(() => {
    const mount = document.getElementById("example")!;
    const terminal = new Terminal.RetroTerminal({
      width: 18,
      height: 21,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    terminal.clear();
    terminal.writeAt({ x: 1, y: 1 }, "Malwoden Says");
    terminal.writeAt({ x: 2, y: 2 }, "Hello World!");

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const num = x + y * 16;
        terminal.drawGlyph({ x: x + 1, y: y + 4 }, Glyph.fromCharCode(num));
      }
    }
    terminal.render();
  }, []);
  return <div id="example" />;
};

export default HelloWorld;
