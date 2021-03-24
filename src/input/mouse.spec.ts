import { JSDOM } from "jsdom";
import { MouseContext, MouseHandler } from "./mouse";

describe("MouseHandler", () => {
  beforeEach(() => {
    const dom = new JSDOM();
    //@ts-ignore
    global.document = dom.window.document;
    //@ts-ignore
    global.window = dom.window;
    //@ts-ignore
    global.Image = window.Image;
    //@ts-ignore
    global.MouseEvent = window.MouseEvent;

    //@ts-ignore
    window.HTMLCanvasElement.prototype.getContext = function () {
      return {
        fillRect: function () {},
        clearRect: function () {},
        getImageData: function (x: number, y: number, w: number, h: number) {
          return {
            data: new Array(w * h * 4),
          };
        },
        putImageData: function () {},
        createImageData: function () {
          return [];
        },
        setTransform: function () {},
        drawImage: function () {},
        save: function () {},
        fillText: function () {},
        restore: function () {},
        beginPath: function () {},
        moveTo: function () {},
        lineTo: function () {},
        closePath: function () {},
        stroke: function () {},
        translate: function () {},
        scale: function () {},
        rotate: function () {},
        arc: function () {},
        fill: function () {},
        measureText: function () {
          return { width: 0 };
        },
        transform: function () {},
        rect: function () {},
        clip: function () {},
      };
    };
  });
  it("Can create a new mouse handler", () => {
    const m = new MouseHandler();
  });

  it("Can get the position", () => {
    const m = new MouseHandler();
    expect(m.getPos()).toEqual({ x: 0, y: 0 });

    m["x"] = 5;
    m["y"] = 10;

    expect(m.getPos()).toEqual({ x: 5, y: 10 });
  });

  it("Will update on mouse movement", () => {
    const m = new MouseHandler();

    m["onMouseUpdateEvent"]({ clientX: 5, clientY: 10 } as any);

    expect(m.getPos()).toEqual({ x: 5, y: 10 });
  });

  it("Can set/unset a mouse context", () => {
    const h = new MouseHandler();
    const c = new MouseContext();

    expect(h["context"]).toBeUndefined();

    h.setContext(c);
    expect(h["context"]).toBe(c);

    h.clearContext();
    expect(h["context"]).toBeUndefined();
  });

  it("Will call a context on events", () => {
    let left = 0;
    let right = 0;

    const h = new MouseHandler();
    const c = new MouseContext()
      .onMouseUp(() => left++)
      .onMouseDown(() => right++, 2);

    h.setContext(c);

    expect(left).toEqual(0);
    expect(right).toEqual(0);

    window.document.dispatchEvent(new MouseEvent("mouseup"));

    expect(left).toEqual(1);
    expect(right).toEqual(0);

    window.document.dispatchEvent(new MouseEvent("mousedown", { button: 2 }));

    expect(left).toEqual(1);
    expect(right).toEqual(1);
  });

  it("Will not call a context if not registered", () => {
    let down = 0;
    let up = 0;
    const h = new MouseHandler();
    const c = new MouseContext();
    c.onMouseDown(() => down++);
    c.onMouseUp(() => up++);

    // Nothing will happen, no context
    expect(down).toEqual(0);
    expect(up).toEqual(0);
    window.document.dispatchEvent(new MouseEvent("mousedown"));
    window.document.dispatchEvent(new MouseEvent("mouseup"));
    expect(down).toEqual(0);
    expect(up).toEqual(0);

    // Register the context now
    h.setContext(c);
    window.document.dispatchEvent(new MouseEvent("mousedown"));
    window.document.dispatchEvent(new MouseEvent("mouseup"));
    expect(down).toEqual(1);
    expect(up).toEqual(1);
  });

  it("Can clear callbacks on a context", () => {
    const c = new MouseContext();

    let onDown = 0;
    let onUp = 0;
    c.onMouseDown(() => onDown++);
    c.onMouseUp(() => onUp++);

    expect(c["onDown"].has(0)).toBeTruthy();
    expect(c["onUp"].has(0)).toBeTruthy();

    c.clearMouseDown();
    c.clearMouseUp();

    expect(c["onDown"].has(0)).toBeFalsy;
    expect(c["onUp"].has(0)).toBeFalsy;
  });

  it("Won't error if context doesn't have a callback", () => {
    const c = new MouseContext();
    c.callOnMouseDown({ x: 0, y: 0 });
    c.callOnMouseUp({ x: 0, y: 0 });
  });

  it("Can call callbacks directly", () => {
    let up = 0;
    let down = 0;
    let up_2 = 0;
    let down_2 = 0;
    const c = new MouseContext()
      .onMouseUp(() => up++)
      .onMouseUp(() => up_2++, 2)
      .onMouseDown(() => down++)
      .onMouseDown(() => down_2++, 2);

    const check = (a: number, b: number, c: number, d: number) => {
      expect(up).toEqual(a);
      expect(up_2).toEqual(b);
      expect(down).toEqual(c);
      expect(down_2).toEqual(d);
    };
    check(0, 0, 0, 0);

    c.callOnMouseUp({ x: 0, y: 0 });
    check(1, 0, 0, 0);
    c.callOnMouseUp({ x: 0, y: 0 }, 2);
    check(1, 1, 0, 0);
    c.callOnMouseDown({ x: 0, y: 0 });
    check(1, 1, 1, 0);
    c.callOnMouseDown({ x: 0, y: 0 }, 2);
    check(1, 1, 1, 1);
  });

  it("Can tell if a mouse button is held down", () => {
    const h = new MouseHandler();

    expect(h.isMouseDown()).toBeFalsy();
    expect(h.isMouseDown(2)).toBeFalsy();

    h["onMouseDownEvent"](new MouseEvent("mousedown", { button: 0 }));
    expect(h.isMouseDown()).toBeTruthy();
    expect(h.isMouseDown(2)).toBeFalsy();

    h["onMouseDownEvent"](new MouseEvent("mousedown", { button: 2 }));
    expect(h.isMouseDown()).toBeTruthy();
    expect(h.isMouseDown(2)).toBeTruthy();

    h["onMouseUpEvent"](new MouseEvent("mouseup", { button: 0 }));
    expect(h.isMouseDown()).toBeFalsy();
    expect(h.isMouseDown(2)).toBeTruthy();

    h["onMouseUpEvent"](new MouseEvent("mouseup", { button: 2 }));
    expect(h.isMouseDown()).toBeFalsy();
    expect(h.isMouseDown(2)).toBeFalsy();
  });
});
