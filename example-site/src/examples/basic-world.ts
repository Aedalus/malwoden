import { Example } from "../example";
import { Terminal, Glyph, CharCode, Input, Color, Generation, Util } from "cacti-term";

function drawDoubleBox(
  terminal: Terminal.BaseTerminal,
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  // Corners
  terminal.drawGlyph(x1, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndRight));
  terminal.drawGlyph(x2, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndLeft));
  terminal.drawGlyph(x1, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndRight));
  terminal.drawGlyph(x2, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndLeft));

  // Horizontal Bars
  for (let dx = x1 + 1; dx < x2; dx++) {
    terminal.drawGlyph(dx, y1, Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal));
    terminal.drawGlyph(dx, y2, Glyph.fromCharCode(CharCode.boxDrawingsDoubleHorizontal));
  }

  // Vertical Bars
  for (let dy = y1 + 1; dy < y2; dy++) {
    terminal.drawGlyph(x1, dy, Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical));
    terminal.drawGlyph(x2, dy, Glyph.fromCharCode(CharCode.boxDrawingsDoubleVertical));
  }
}

export default class extends Example {
  Run() {
    // Entities
    const player = {
      x: 5,
      y: 5,
    };

    // Keyboard
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext();
    movement.onDown(Input.KeyCode.DownArrow, () => {
      player.y++;
      console.log("Down!");
    });
    movement.onDown(Input.KeyCode.LeftArrow, () => {
      player.x--;
      console.log("Left!");
    });
    movement.onDown(Input.KeyCode.RightArrow, () => {
      player.x++;
      console.log("Right!");
    });
    movement.onDown(Input.KeyCode.UpArrow, () => {
      player.y--;
      console.log("Up!");
    });
    keyboard.setContext(movement);

    // Generate Map
    const map_width = 62;
    const map_height = 38;
    const map = new Util.Table<number>(map_width, map_height);
    map.fill(1); // 1 is a wall

    const rect = new Generation.BSPTreeRect({
      x1: 0,
      y1: 0,
      x2: map_width,
      y2: map_height,
      depth: 0,
    });

    const subrects = rect.splitUntil(3);
    const rooms = subrects.map((r) =>
      Generation.RectGen.SubRect(r, {
        minWidth: r.width() / 2,
        minHeight: r.height() / 2,
        maxWidth: r.width(),
        maxHeight: r.height(),
      })
    );

    for (let r of rooms) {
      for (let x = r.x1; x < r.x2; x++) {
        for (let y = r.y1; y < r.y2; y++) {
          map.set(x, y, 0);
        }
      }
    }

    const terminal = Terminal.Retro.fromURL(80, 50, "font_16.png", 16, 16);
    // ToDo - Fix this API. 2 Vectors?
    const mapterminal = new Terminal.PortTerminal(17, 1, { x: map_width, y: map_height }, terminal);

    const loop = (delta: number) => {
      terminal.clear();

      // Player Box
      drawDoubleBox(terminal, 0, 15, 0, 39);
      terminal.writeAt({
        x: 2,
        y: 0,
        text: " Player ",
      });

      // World Box
      drawDoubleBox(terminal, 16, 79, 0, 39);

      // Log Box
      drawDoubleBox(terminal, 0, 79, 40, 49);
      terminal.writeAt({
        x: 2,
        y: 40,
        text: " Log ",
      });

      // Draw Map
      for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
          const isWall = map.get(x, y);
          mapterminal.drawCharCode({
            x,
            y,
            charCode: isWall ? CharCode.xUpper : CharCode.space,
          });
        }
      }

      // Player Entity
      mapterminal.drawGlyph(player.x, player.y, Glyph.fromCharCode(CharCode.at, Color.yellow));

      terminal.render();

      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }
}
