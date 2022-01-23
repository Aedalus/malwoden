import { Terminal, GUI, Input, Color } from "malwoden";
import { MouseHandler } from "../../../../dist/types/input";
import { IExample } from "../example";

export class CustomWidgetExample implements IExample {
  mount: HTMLElement;
  animRef: number;
  terminal: Terminal.RetroTerminal;
  gui: GUI.Widget<any>;

  mouse: MouseHandler;

  constructor() {
    this.mount = document.getElementById("example")!;
    this.terminal = new Terminal.RetroTerminal({
      width: 50,
      height: 30,
      imageURL: "/font_16.png",
      charWidth: 16,
      charHeight: 16,
      mountNode: this.mount,
    });

    this.mouse = new Input.MouseHandler();

    // Create a Container to hold other widgets!
    // Set a terminal at the root of the widgets.
    this.gui = new GUI.ContainerWidget().setTerminal(this.terminal);

    new GUI.TextWidget({
      origin: { x: 1, y: 1 },
      initialState: {
        text:
          "This timer is a custom widget, built in the example on top of the 'Widget' base class.",
        wrapAt: 48,
      },
    }).setParent(this.gui);

    new GUI.TextWidget({
      origin: { x: 1, y: 4 },
      initialState: {
        text:
          "Using custom widgets can help to bring your own styles, while providing a flexible framework.",
        wrapAt: 48,
      },
    }).setParent(this.gui);

    // Completely custom widget, defined at bottom of the file
    new TimerWidget({
      origin: { x: 19, y: 15 },
      initialState: { endTime: Date.now() + 1000 * 10 }, // Add 10 seconds to the timer!
    }).setParent(this.gui);

    // Set up some animations
    this.animRef = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.terminal.clear();

    this.gui.cascadeUpdate();
    this.gui.cascadeDraw();
    this.terminal.render();

    this.animRef = requestAnimationFrame(() => this.loop());
  }

  cleanup() {
    window.cancelAnimationFrame(this.animRef);
    this.terminal.delete();
  }
}

interface TimerWidgetState {
  endTime: number;
}

class TimerWidget extends GUI.Widget<TimerWidgetState> {
  getColor(secondsLeft: number) {
    if (secondsLeft > 5) return Color.Green;
    if (secondsLeft > 1) return Color.Yellow;
    return Color.Red;
  }
  onDraw(): void {
    if (!this.terminal) return; // Will get it from a parent class
    const currentTime = Date.now();
    const timeLeft = this.state.endTime - currentTime;
    const secondsLeft = Math.floor(timeLeft / 1000);
    const msLeft = timeLeft % 1000;

    if (secondsLeft > 0 || msLeft > 0) {
      this.terminal.writeAt(
        this.origin,
        `Timer: ${secondsLeft}.${msLeft}`,
        this.getColor(secondsLeft)
      );
    } else {
      this.terminal.writeAt(this.origin, "Time is up!");
    }
  }
}
