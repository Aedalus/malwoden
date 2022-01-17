import { MemoryTerminal } from "../terminal/memory-terminal";
import { wrapText, truncateText, TextWidget } from "./text-widget";

describe("truncateText", () => {
  it("Can truncate text without ellipsis", () => {
    expect(
      truncateText({
        text: "Hello World",
        truncateAfter: 8,
        addEllipsis: false,
      })
    ).toEqual("Hello Wo");
  });
  it("Can truncate text with ellipsis", () => {
    expect(
      truncateText({
        text: "Hello World",
        truncateAfter: 8,
        addEllipsis: true,
      })
    ).toEqual("Hello...");
  });
});

describe("splitAtWrap", () => {
  it("Can split a larger body of text", () => {
    const text = "Hello world how are you doing today?";
    expect(wrapText({ text, wrapAt: 10 })).toEqual([
      "Hello",
      "world how",
      "are you",
      "doing",
      "today?",
    ]);
  });
  it("will pass back an empty array for no text", () => {
    expect(
      wrapText({
        text: "",
        wrapAt: 4,
      })
    ).toEqual([]);
  });
});

describe("TextWidget", () => {
  it("Can render basic text", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const w = new TextWidget({
      initialState: { text: "Hello World" },
    });

    w.onDraw({ terminal });
  });

  it("Can truncate text", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const w = new TextWidget({
      initialState: { text: "Hello World", truncateAfter: 8 },
    });

    w.onDraw({ terminal });
  });

  it("Can wrap text", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const w = new TextWidget({
      initialState: { text: "Hello World", wrapAt: 8 },
    });

    w.onDraw({ terminal });
  });
});
