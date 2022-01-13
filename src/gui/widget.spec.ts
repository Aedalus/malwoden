import { MemoryTerminal } from "../terminal/memory-terminal";
import { Widget, WidgetDrawCtx, WidgetMouseEvent } from "./widget";

class TestWidget<S, D> extends Widget<S, D> {
  onDraw(ctx: WidgetDrawCtx): void {}
}

const ntw = () => new TestWidget({ initialState: {} });

describe("widget", () => {
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
    w.update({});
    expect(w.getState()).toEqual({ number: 1 });
  });

  it("Can clear an update func", () => {
    const w = new TestWidget({ initialState: { number: 0 } });
    expect(w.getState()).toEqual({ number: 0 });
    w.setUpdateFunc(() => ({ number: 1 }));
    w.clearUpdateFunc();
    w.update({});
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

    c.setUpdateFunc((_, w) => ({ n: w.getState().n + 1 }));
    p.setUpdateFunc((_, w) => ({ n: w.getState().n + 1 }));

    expect(c.getState()).toEqual({ n: 0 });
    expect(p.getState()).toEqual({ n: 0 });

    p.cascadeUpdate({});

    expect(c.getState()).toEqual({ n: 1 });
    expect(p.getState()).toEqual({ n: 1 });

    p.clearUpdateFunc();
    p.cascadeUpdate({});

    expect(c.getState()).toEqual({ n: 2 });
    expect(p.getState()).toEqual({ n: 1 });
  });

  it("can cascade draw", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const p = new TestWidget({ initialState: { n: 0 } });
    const c = new TestWidget({ initialState: { n: 0 } });

    const pSpy = jest.spyOn(p, "onDraw").mockImplementation(() => {});
    const cSpy = jest.spyOn(c, "onDraw").mockImplementation(() => {});

    c.setParent(p);

    p.cascadeDraw({ terminal });

    expect(pSpy).toHaveBeenCalledTimes(1);
    expect(cSpy).toHaveBeenCalledTimes(1);
  });

  it("can cascade click", () => {
    const p = ntw();
    const c = ntw();

    const pSpy = jest.spyOn(p, "onClick").mockImplementation(() => false);
    const cSpy = jest.spyOn(c, "onClick").mockImplementation(() => false);

    c.setParent(p);

    p.cascadeClick({ button: 0, type: "mousedown", x: 1, y: 1 });

    expect(pSpy).toHaveBeenCalledTimes(1);
    expect(cSpy).toHaveBeenCalledTimes(1);
  });

  it("will return false on baseline onClick", () => {
    const p = ntw();

    expect(p.onClick({ x: 0, y: 0, button: 0, type: "mousedown" })).toEqual(
      false
    );
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

    p.cascadeDraw({ terminal });

    p.draw({ terminal });
    c.draw({ terminal });

    expect(pDrawSpy).toHaveBeenCalledTimes(0);
    expect(cDrawSpy).toHaveBeenCalledTimes(0);

    const pClickSpy = jest.spyOn(p, "onClick").mockImplementation(() => false);
    const cClickSpy = jest.spyOn(c, "onClick").mockImplementation(() => false);

    const mouse: WidgetMouseEvent = {
      x: 0,
      y: 1,
      button: 1,
      type: "mousedown",
    };
    p.cascadeClick(mouse);
    p.click(mouse);
    c.click(mouse);

    expect(pClickSpy).toHaveBeenCalledTimes(0);
    expect(cClickSpy).toHaveBeenCalledTimes(0);
  });

  it("will stop a click cascade on capture", () => {
    const p = ntw();
    const c = ntw();
    c.setParent(p);

    const pClickSpy = jest.spyOn(p, "onClick").mockImplementation(() => false);
    const cClickSpy = jest.spyOn(c, "onClick").mockImplementation(() => true);

    const mouse: WidgetMouseEvent = {
      x: 0,
      y: 1,
      button: 1,
      type: "mousedown",
    };

    p.cascadeClick(mouse);

    expect(pClickSpy).toHaveBeenCalledTimes(0);
    expect(cClickSpy).toHaveBeenCalledTimes(1);
  });
});
