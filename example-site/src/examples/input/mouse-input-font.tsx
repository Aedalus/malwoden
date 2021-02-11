import React, { useEffect } from "react";

import { CharCode, Color, Terminal, Input } from "malwoden";

const MouseInput = () => {
<<<<<<< HEAD:example-site/src/examples/input/mouse-input-font.tsx
  const requestRef = React.useRef<number>(NaN);

  useEffect(() => {
    const mountNode = document.getElementById("example")!;
=======
  const requestRef = React.useRef<number>();

  useEffect(() => {
    const mountNode = document.getElementById("example");
>>>>>>> 89d998a6a685a92fc85cd4b9c38d6767791bc786:example-site/examples/input/mouse-input-font.tsx
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
