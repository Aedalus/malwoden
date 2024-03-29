import { MouseContext, MouseHandler, MouseHandlerEvent } from "../input";
import { MemoryTerminal } from "../terminal/memory-terminal";
import { Widget } from "./widget";
import { Glyph } from "../terminal";
import { setupTestDom } from "../input/test-utils.spec";

class TestWidget<S> extends Widget<S> {
  onDraw(): void {}
}

const ntw = () => new TestWidget({ initialState: {} });

describe("widget", () => {
  beforeEach(setupTestDom);

  it("Can add/remove a child", () => {
    const parent = ntw();
    const childA = ntw();
    const childB = ntw();

    parent.addChild(childA);
    expect(parent["children"]).toEqual([childA]);
    parent.addChild(childB);
    expect(parent["children"]).toEqual([childA, childB]);

    parent.removeChild(childA);
    expect(parent["children"]).toEqual([childB]);
    parent.removeChild(childB);
    expect(parent["children"]).toEqual([]);
  });

  it("Can set state", () => {
    const w = new TestWidget({ initialState: { number: 0 } });
    expect(w.getState()).toEqual({ number: 0 });
    w.setState({ number: 1 });
    expect(w.getState()).toEqual({ number: 1 });
  });

  it("Can set/get the origin", () => {
    const w = ntw();

    expect(w.getAbsoluteOrigin()).toEqual({ x: 0, y: 0 });
    expect(w.getOrigin()).toEqual({ x: 0, y: 0 });

    w.setOrigin({ x: 2, y: 1 });

    expect(w.getAbsoluteOrigin()).toEqual({ x: 2, y: 1 });
    expect(w.getOrigin()).toEqual({ x: 2, y: 1 });
  });

  it("Can check for disabled/not disabled", () => {
    const w = ntw();
    expect(w.isDisabled()).toBeFalsy();

    w.setDisabled(true);
    expect(w.isDisabled()).toBeTruthy();

    w.setDisabled(false);
    expect(w.isDisabled()).toBeFalsy();
  });

  it("Can set an update func", () => {
    const w = new TestWidget({ initialState: { number: 0 } });
    expect(w.getState()).toEqual({ number: 0 });
    w.setUpdateFunc(() => ({ number: 1 }));
    w.update();
    expect(w.getState()).toEqual({ number: 1 });
  });

  it("Can clear an update func", () => {
    const w = new TestWidget({ initialState: { number: 0 } });
    expect(w.getState()).toEqual({ number: 0 });
    w.setUpdateFunc(() => ({ number: 1 }));
    w.clearUpdateFunc();
    w.update();
    expect(w.getState()).toEqual({ number: 0 });
  });

  it("can calculate local/absolute positions", () => {
    const p = ntw();
    const c = ntw();
    const c2 = ntw();

    c2.setOrigin({ x: 1, y: 1 });
    c2.setParent(c);

    c.setOrigin({ x: 1, y: 2 });
    c.setParent(p);

    expect(p.getAbsoluteOrigin()).toEqual({ x: 0, y: 0 });
    expect(p.absoluteToLocal({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(p.absoluteToLocal({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(p.localToAbsolute({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(p.localToAbsolute({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });

    expect(c.getAbsoluteOrigin()).toEqual({ x: 1, y: 2 });
    expect(c.absoluteToLocal({ x: 0, y: 0 })).toEqual({ x: -1, y: -2 });
    expect(c.absoluteToLocal({ x: 1, y: 2 })).toEqual({ x: 0, y: 0 });
    expect(c.localToAbsolute({ x: 0, y: 0 })).toEqual({ x: 1, y: 2 });
    expect(c.localToAbsolute({ x: -1, y: -2 })).toEqual({ x: 0, y: 0 });

    expect(c2.getAbsoluteOrigin()).toEqual({ x: 2, y: 3 });
  });

  it("can set a parent", () => {
    const p1 = ntw();
    const p2 = ntw();
    const c = ntw();

    expect(c["parent"]).toEqual(undefined);

    c.setParent(p1);
    expect(c["parent"]).toEqual(p1);
    expect(p1["children"]).toEqual([c]);
    expect(p2["children"]).toEqual([]);

    c.setParent(p2);
    expect(p1["children"]).toEqual([]);
    expect(p2["children"]).toEqual([c]);
  });

  it("can cascade update", () => {
    const p = new TestWidget({ initialState: { n: 0 } });
    const c = new TestWidget({ initialState: { n: 0 } });

    c.setParent(p);

    c.setUpdateFunc(() => ({ n: c.getState().n + 1 }));
    p.setUpdateFunc(() => ({ n: p.getState().n + 1 }));

    expect(c.getState()).toEqual({ n: 0 });
    expect(p.getState()).toEqual({ n: 0 });

    p.cascadeUpdate();

    expect(c.getState()).toEqual({ n: 1 });
    expect(p.getState()).toEqual({ n: 1 });

    // Test after clear
    p.clearUpdateFunc();
    p.cascadeUpdate();

    expect(c.getState()).toEqual({ n: 2 });
    expect(p.getState()).toEqual({ n: 1 });
  });

  it("won't update if disabled", () => {
    const w = new TestWidget({ initialState: { n: 0 } })
      .setDisabled()
      .setUpdateFunc(() => ({ n: 1 }));

    w.update();
    expect(w.getState().n).toEqual(0);
  });

  it("won't cascade update if disabled", () => {
    const p = new TestWidget({ initialState: { n: 0 } }).setDisabled();
    const c = new TestWidget({ initialState: { n: 0 } })
      .setUpdateFunc(() => ({
        n: 1,
      }))
      .setParent(p);

    p.cascadeUpdate();
    expect(c.getState().n).toEqual(0);

    p.setDisabled(false);

    p.cascadeUpdate();
    expect(c.getState().n).toEqual(1);
  });

  it("can cascade draw", () => {
    const p = new TestWidget({ initialState: { n: 0 } });
    const c = new TestWidget({ initialState: { n: 0 } });

    const pSpy = jest.spyOn(p, "onDraw").mockImplementation(() => {});
    const cSpy = jest.spyOn(c, "onDraw").mockImplementation(() => {});

    c.setParent(p);

    p.cascadeDraw();

    expect(pSpy).toHaveBeenCalledTimes(1);
    expect(cSpy).toHaveBeenCalledTimes(1);
  });

  it("can cascade click", () => {
    const p = ntw();
    const c = ntw();

    const pSpy = jest.spyOn(p, "onMouseClick").mockImplementation(() => false);
    const cSpy = jest.spyOn(c, "onMouseClick").mockImplementation(() => false);

    c.setParent(p);

    p.cascadeMouseClick({ button: 0, type: "mousedown", x: 1, y: 1 });

    expect(pSpy).toHaveBeenCalledTimes(1);
    expect(cSpy).toHaveBeenCalledTimes(1);
  });

  it("will return false on baseline onClick", () => {
    const p = ntw();

    expect(
      p.onMouseClick({ x: 0, y: 0, button: 0, type: "mousedown" })
    ).toEqual(false);
  });

  it("can set the origin in the constructor", () => {
    const p = new TestWidget({ initialState: {}, origin: { x: 1, y: 2 } });

    expect(p.getOrigin()).toEqual({ x: 1, y: 2 });
  });

  it("will exit on cascades if disabled", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const p = ntw().setDisabled();
    const c = ntw().setDisabled();
    c.setParent(p);

    const pDrawSpy = jest.spyOn(p, "onDraw").mockImplementation(() => {});
    const cDrawSpy = jest.spyOn(c, "onDraw").mockImplementation(() => {});

    p.cascadeDraw();

    p.draw();
    c.draw();

    expect(pDrawSpy).toHaveBeenCalledTimes(0);
    expect(cDrawSpy).toHaveBeenCalledTimes(0);

    const pClickSpy = jest
      .spyOn(p, "onMouseClick")
      .mockImplementation(() => false);
    const cClickSpy = jest
      .spyOn(c, "onMouseClick")
      .mockImplementation(() => false);

    const mouse: MouseHandlerEvent = {
      x: 0,
      y: 1,
      button: 1,
      type: "mousedown",
    };
    p.cascadeMouseClick(mouse);
    p.mouseClick(mouse);
    c.mouseClick(mouse);

    expect(pClickSpy).toHaveBeenCalledTimes(0);
    expect(cClickSpy).toHaveBeenCalledTimes(0);
  });

  it("will stop a click cascade on capture", () => {
    const p = ntw();
    const c = ntw();
    c.setParent(p);

    const pClickSpy = jest
      .spyOn(p, "onMouseClick")
      .mockImplementation(() => false);
    const cClickSpy = jest
      .spyOn(c, "onMouseClick")
      .mockImplementation(() => true);

    const mouse: MouseHandlerEvent = {
      x: 0,
      y: 1,
      button: 1,
      type: "mousedown",
    };

    p.cascadeMouseClick(mouse);

    expect(pClickSpy).toHaveBeenCalledTimes(0);
    expect(cClickSpy).toHaveBeenCalledTimes(1);
  });

  it("Can register a mouse context", () => {
    const c = new MouseContext();
    const w = ntw();
    w.registerMouseContext(c);

    expect(w["mouseRegistration"]).toBeTruthy();
    expect(w["mouseRegistration"]?.mouseContext).toBeTruthy();
    expect(w["mouseRegistration"]?.mouseOnDown).toBeTruthy();
    expect(w["mouseRegistration"]?.mouseOnUp).toBeTruthy();

    w.clearMouseContext();
    expect(w["mouseRegistration"]).toBeFalsy();
  });

  it("Can act on a mouseClick", () => {
    const w = ntw();

    const pClickSpy = jest
      .spyOn(w, "onMouseClick")
      .mockImplementation(() => false);

    const event: MouseHandlerEvent = {
      x: 0,
      y: 0,
      type: "mousedown",
      button: 0,
    };
    w.mouseClick(event);
    expect(pClickSpy).toHaveBeenCalledTimes(1);

    w.setDisabled();
    w.mouseClick(event);
    expect(pClickSpy).toHaveBeenCalledTimes(1);
  });

  it("Can draw a glyph relative to it's position", () => {
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const w = ntw().setOrigin({ x: 1, y: 1 }).setTerminal(t);

    const g = new Glyph("f");
    w.drawGlyph({ x: 0, y: 0 }, g);
    expect(t.glyphs.get({ x: 1, y: 1 })).toEqual(g);

    // test without terminal
    w.setTerminal();
    w.drawGlyph({ x: 1, y: 1 }, g);
    expect(t.glyphs.get({ x: 2, y: 2 })).toBeUndefined();
  });

  it("can set/unset terminal/mouseHandler from children", () => {
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const h = new MouseHandler();
    const p = ntw().setTerminal(t).setMouseHandler(h);
    const c = ntw().setParent(p);

    expect(p["mouseHandler"]).toBeTruthy();
    expect(p["terminal"]).toBeTruthy();

    expect(c["mouseHandler"]).toBeTruthy();
    expect(c["terminal"]).toBeTruthy();

    p.removeChild(c);

    expect(c["mouseHandler"]).toBeFalsy();
    expect(c["terminal"]).toBeFalsy();

    // won't error out on second call
    expect(p.removeChild(c)).toBeUndefined();
  });
});
