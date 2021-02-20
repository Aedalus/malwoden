import { BaseTerminal, CharCode, Glyph } from "../terminal";
import { TerminalConfig } from "../terminal/terminal";
import { Table, Vector2 } from "../util";
import { box } from "./box";

class TestTerm extends BaseTerminal {
  table: Table<Glyph>;

  constructor(config: TerminalConfig) {
    super(config);
    this.table = new Table<Glyph>(config.width, config.height);
  }

  drawGlyph(pos: Vector2, glyph: Glyph): void {
    this.table.set(pos, glyph);
  }
}

describe("box", () => {
  it("Can draw a box", () => {
    const t = new TestTerm({ width: 10, height: 10 });

    box(t, { origin: { x: 0, y: 0 }, width: 5, height: 5 });
    // Check corners
    expect(
      t.table
        .get({ x: 0, y: 0 })
        ?.isEqual(Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndRight))
    ).toBeTruthy();
    expect(
      t.table
        .get({ x: 5, y: 0 })
        ?.isEqual(Glyph.fromCharCode(CharCode.boxDrawingsDoubleDownAndLeft))
    ).toBeTruthy();
    expect(
      t.table
        .get({ x: 0, y: 5 })
        ?.isEqual(Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndRight))
    ).toBeTruthy();
    expect(
      t.table
        .get({ x: 5, y: 5 })
        ?.isEqual(Glyph.fromCharCode(CharCode.boxDrawingsDoubleUpAndLeft))
    ).toBeTruthy();
  });
  it("Can draw a title", () => {
    const t = new TestTerm({ width: 10, height: 10 });

    box(t, { origin: { x: 0, y: 0 }, width: 6, height: 1, title: "Foo" });

    expect(t.table.get({ x: 2, y: 0 })?.isEqual(new Glyph(" "))).toBeTruthy();
    expect(t.table.get({ x: 3, y: 0 })?.isEqual(new Glyph("F"))).toBeTruthy();
    expect(t.table.get({ x: 4, y: 0 })?.isEqual(new Glyph("o"))).toBeTruthy();
    expect(t.table.get({ x: 5, y: 0 })?.isEqual(new Glyph("o"))).toBeTruthy();
    expect(t.table.get({ x: 6, y: 0 })?.isEqual(new Glyph(" "))).toBeTruthy();
  });
});
