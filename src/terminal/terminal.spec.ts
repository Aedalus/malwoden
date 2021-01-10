import { format } from "path";
import { Table, Vector2 } from "../util";
import { CharCode } from "./char-code";
import { Color } from "./color";
import { Glyph } from "./glyph";
import { BaseTerminal, TerminalConfig } from "./terminal";

class TestTerminal extends BaseTerminal {
  table: Table<Glyph>;
  constructor(config: TerminalConfig) {
    super(config);

    this.table = new Table(config.width, config.height);
  }
  drawGlyph(pos: Vector2, glyph: Glyph): void {
    this.table.set(pos, glyph);
  }
}

describe("BaseTerminal", () => {
  it("Can create a new base terminal", () => {
    const t = new TestTerminal({
      width: 10,
      height: 10,
      foreColor: Color.Yellow,
      backColor: Color.Green,
    });

    expect(t.width).toEqual(10);
    expect(t.height).toEqual(10);
    expect(t.foreColor.isEqual(Color.Yellow)).toBeTruthy();
    expect(t.backColor.isEqual(Color.Green)).toBeTruthy();
  });

  it("Can draw a charCode", () => {
    const t = new TestTerminal({
      width: 10,
      height: 10,
    });

    t.drawCharCode({ x: 1, y: 2 }, 102);
    let glyph = t.table.get({ x: 1, y: 2 });
    expect(glyph?.char).toEqual(102);
    expect(glyph?.fore.isEqual(Color.White)).toBeTruthy();
    expect(glyph?.back.isEqual(Color.Black)).toBeTruthy();

    t.drawCharCode({ x: 1, y: 2 }, 102, Color.Green, Color.Yellow);
    glyph = t.table.get({ x: 1, y: 2 });
    expect(glyph?.char).toEqual(102);
    expect(glyph?.fore.isEqual(Color.Green)).toBeTruthy();
    expect(glyph?.back.isEqual(Color.Yellow)).toBeTruthy();
  });

  it("Can get the size", () => {
    const t = new TestTerminal({ width: 10, height: 20 });

    expect(t.size()).toEqual({ x: 10, y: 20 });
  });

  it("Can clear", () => {
    const t = new TestTerminal({ width: 10, height: 10 });
    t.clear();

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        expect(t.table.get({ x, y })?.isEqual(new Glyph(" ")));
      }
    }
  });

  it("Can writeAt", () => {
    const t = new TestTerminal({
      width: 10,
      height: 10,
    });

    t.writeAt({ x: 1, y: 1 }, "abc");

    const a = t.table.get({ x: 1, y: 1 })!;
    const b = t.table.get({ x: 2, y: 1 })!;
    const c = t.table.get({ x: 3, y: 1 })!;

    expect(a.char).toEqual("a".charCodeAt(0));
    expect(b.char).toEqual("b".charCodeAt(0));
    expect(c.char).toEqual("c".charCodeAt(0));

    t.writeAt({ x: 1, y: 1 }, "abc", Color.Green, Color.Blue);

    const a2 = t.table.get({ x: 1, y: 1 })!;
    const b2 = t.table.get({ x: 2, y: 1 })!;
    const c2 = t.table.get({ x: 3, y: 1 })!;

    expect(a2.isEqual(new Glyph("a", Color.Green, Color.Blue)));
    expect(b2.isEqual(new Glyph("b", Color.Green, Color.Blue)));
    expect(c2.isEqual(new Glyph("c", Color.Green, Color.Blue)));
  });

  it("Will truncate writeAt if too long", () => {
    const t = new TestTerminal({ width: 5, height: 5 });
    t.writeAt({ x: 0, y: 0 }, "Hello!");
    expect(t.table.get({ x: 5, y: 0 })).toEqual(undefined);
  });
});

describe("PortTerminal", () => {
  it("Can create a new port terminal", () => {
    const t = new TestTerminal({ width: 10, height: 10 });

    const p = t.port({ x: 5, y: 5 }, 2, 3);

    expect(p.width).toEqual(2);
    expect(p.height).toEqual(3);
  });

  it("Can draw a new glyph", () => {
    const t = new TestTerminal({ width: 10, height: 10 });

    const p = t.port({ x: 5, y: 5 }, 2, 3);
    p.drawGlyph({ x: 1, y: 2 }, Glyph.fromCharCode(CharCode.at));

    expect(
      t.table.get({ x: 6, y: 7 })?.isEqual(Glyph.fromCharCode(CharCode.at))
    ).toBeTruthy();
    expect(p.width).toEqual(2);
    expect(p.height).toEqual(3);
  });

  it("Can create a nested port terminal", () => {
    const t = new TestTerminal({ width: 10, height: 10 });
    const p1 = t.port({ x: 1, y: 1 }, 5, 5);
    const p2 = p1.port({ x: 1, y: 1 }, 2, 2);

    p2.drawGlyph({ x: 0, y: 0 }, new Glyph(" "));

    expect(t.table.get({ x: 2, y: 2 })?.isEqual(new Glyph(" "))).toBeTruthy();
  });

  it("Will not draw if outside the port", () => {
    const t = new TestTerminal({ width: 10, height: 10 });
    const p = t.port({ x: 5, y: 5 }, 4, 4);

    p.drawGlyph({ x: -1, y: 0 }, new Glyph("x"));
    p.drawGlyph({ x: 5, y: 0 }, new Glyph("x"));
    p.drawGlyph({ x: 0, y: -1 }, new Glyph("x"));
    p.drawGlyph({ x: 0, y: 5 }, new Glyph("x"));

    for (let x = 0; x < t.table.width; x++) {
      for (let y = 0; y < t.table.height; y++) {
        expect(t.table.get({ x, y })).toBeUndefined();
      }
    }
  });
});
