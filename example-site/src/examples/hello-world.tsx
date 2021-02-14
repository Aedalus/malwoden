import React, { useEffect } from "react";

import { Glyph, Terminal } from "malwoden";

const HelloWorld = () => {
  useEffect(() => {
    const mount = document.getElementById("example")!;
    const terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 30,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: mount,
    });

    terminal.clear();
    terminal.writeAt({ x: 1, y: 1 }, "Hello World!");

    terminal.writeAt({ x: 1, y: 5 }, "Malwoden is great");
    terminal.writeAt({ x: 1, y: 6 }, "at rendering");
    terminal.writeAt({ x: 1, y: 7 }, "CP437 tilesets");

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const num = x + y * 16;
        terminal.drawGlyph({ x: x + 26, y: y + 5 }, Glyph.fromCharCode(num));
      }
    }
    terminal.render();
  }, []);
  return <div id="example" />;
};

export default HelloWorld;
