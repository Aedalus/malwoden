import React, { useEffect } from "react";

import { CharCode, Color, Terminal, Input } from "malwoden";

const MouseInputFont = () => {
  const requestRef = React.useRef<number>(NaN);

  useEffect(() => {
    const mountNode = document.getElementById("example")!;
    const font = new Terminal.Font("Courier New", 24);
    const terminal = new Terminal.CanvasTerminal({
      width: 50,
      height: 20,
      font,
      mountNode,
    });

    let clickMessage = "Try Clicking!";
    const mouse = new Input.MouseHandler();
    const c = new Input.MouseContext()
      .onMouseDown((pos) => {
        const termPos = terminal.pixelToChar(pos);
        clickMessage = `mousedown on ${termPos.x}, ${termPos.y}`;
      })
      .onMouseUp((pos) => {
        const termPos = terminal.pixelToChar(pos);
        clickMessage = `mouseup on ${termPos.x}, ${termPos.y}`;
      });
    mouse.setContext(c);

    function loop() {
      terminal.clear();
      // Draw mouse position
      const mousePos = mouse.getPos();
      const char = terminal.pixelToChar(mousePos);
      terminal.drawCharCode(char, CharCode.at, Color.Yellow);

      // Draw mouse message
      terminal.writeAt({ x: 0, y: 0 }, clickMessage);

      // Render
      terminal.render();
      requestRef.current = requestAnimationFrame(loop);
    }
    requestRef.current = requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(requestRef.current);
  }, []);
  return <div id="example"></div>;
};

export default MouseInputFont;
