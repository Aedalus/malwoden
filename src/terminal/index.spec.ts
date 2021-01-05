import * as Terminal from "./index";

describe("Terminal Module", () => {
  it("Should have expected outputs", () => {
    const exports = Object.keys(Terminal);

    expect(exports).toEqual([
      "CanvasTerminal",
      "Font",
      "Retro",
      "Color",
      "Glyph",
      "CharCode",
      "BaseTerminal",
      "PortTerminal",
    ]);
  });
});
