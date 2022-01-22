import { MemoryTerminal } from "../terminal/memory-terminal";
import { PanelWidget } from "./panel-widget";

describe("PanelWidget", () => {
  it("Can render a basic panel", () => {
    const terminal = new MemoryTerminal({ width: 20, height: 20 });
    const p = new PanelWidget({ initialState: { width: 10, height: 10 } });

    p.onDraw();
  });
  it("Can render a border panel", () => {
    const terminal = new MemoryTerminal({ width: 20, height: 20 });
    const p = new PanelWidget({
      initialState: { width: 10, height: 10, borderStyle: "double-bar" },
    });

    p.onDraw();
  });
});
