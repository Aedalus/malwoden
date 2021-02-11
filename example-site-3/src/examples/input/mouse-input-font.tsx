import React, { useEffect } from "react";

import { CharCode, Color, Terminal, Input } from "malwoden";

const MouseInput = () => {
  const requestRef = React.useRef<number>(NaN);

  useEffect(() => {
    const mountNode = document.getElementById("example")!;
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
      requestRef.current = requestAnimationFrame(loop);
    }
    requestRef.current = requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(requestRef.current);
  }, []);
  return <div id="example"></div>;
};

export default MouseInput;
