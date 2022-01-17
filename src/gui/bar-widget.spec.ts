import { MemoryTerminal } from "../terminal/memory-terminal";
import { BarWidget, getRoundedPercent } from "./bar-widget";

describe("getRoundedPercent", () => {
  it("Can get the floor", () => {
    expect(getRoundedPercent(0.12, 10, "down")).toEqual(0.1);
    expect(getRoundedPercent(0.12, 10, "up")).toEqual(0.2);
    expect(getRoundedPercent(0.12, 10, "default")).toEqual(0.1);
  });
});

describe("BarWidget", () => {
  it("Can draw a bar", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const w = new BarWidget({
      initialState: {
        maxValue: 10,
        width: 10,
      },
    });

    w.onDraw({ terminal });
  });
});
