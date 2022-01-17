import { Color, Glyph } from ".";
import { MemoryTerminal } from "./memory-terminal";

describe("MemoryTerminal", () => {
  it("will write glyphs to memory", () => {
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const g = new Glyph(" ", Color.Green, Color.Blue);
    t.drawGlyph({ x: 0, y: 0 }, g);

    expect(t.glyphs.get({ x: 0, y: 0 })).toEqual(g);
    expect(t.glyphs.get({ x: 1, y: 0 })).toEqual(undefined);
  });

  it("will not throw when writing glyphs out of bounds", () => {
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const g = new Glyph(" ", Color.Green, Color.Blue);
    t.drawGlyph({ x: -1, y: 0 }, g);
  });
});
