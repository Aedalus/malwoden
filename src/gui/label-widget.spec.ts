import { MemoryTerminal } from "../terminal/memory-terminal";
import { LabelWidget } from "./label-widget";

describe("LabelWidget", () => {
  it("Can render a basic label", () => {
    const terminal = new MemoryTerminal({ width: 20, height: 20 });
    const w = new LabelWidget({
      initialState: { text: "Hello!", direction: "left" },
    });

    w.onDraw({ terminal });

    w.setState({ direction: "right" });

    w.onDraw({ terminal });
  });
});
