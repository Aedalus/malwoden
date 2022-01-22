import { JSDOM } from "jsdom";
import { MouseHandler, MouseHandlerEvent } from "../input";
import { MemoryTerminal } from "../terminal/memory-terminal";
import { ButtonWidget, HoverState } from "./button-widget";
import { Color } from "../terminal";

describe("ButtonWidget", () => {
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

  it("can draw a basic button", () => {
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const b = new ButtonWidget({ initialState: { text: "button" } });

    b.onDraw();
    b.setTerminal(t);

    b.onDraw();

    b.setState({ padding: 1, borderStyle: "single-bar" });
    b.onDraw();
    b.setState({ borderStyle: "double-bar" });
    b.onDraw();
  });

  it("can get padding", () => {
    const b = new ButtonWidget({ initialState: { text: "button" } }).setState({
      padding: 1,
    });

    expect(b["getPadding"]()).toEqual(1);
    b.setState({ padding: undefined });
    expect(b["getPadding"]()).toEqual(0);
  });

  it("can get bounds", () => {
    const b = new ButtonWidget({ initialState: { text: "Hello" } });

    const bounds = b["getBounds"]();
    expect(bounds.v1).toEqual({ x: 0, y: 0 });
    expect(bounds.v2).toEqual({ x: 4, y: 0 });
  });

  it("can get the proper mouse handler from mouse state", () => {
    const h = new MouseHandler();
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const b = new ButtonWidget({ initialState: { text: "Hello" } })
      .setTerminal(t)
      .setMouseHandler(h);

    const bounds = b["getBounds"]();
    expect(bounds.v1).toEqual({ x: 0, y: 0 });
    expect(bounds.v2).toEqual({ x: 4, y: 0 });

    const mouseState = b["getMouseStateFromMouseHandler"](h, t);
    expect(mouseState).toEqual(HoverState.Hover);

    h["_isDown"].add(0);
    expect(bounds.contains(h.getPos()));
    debugger;
    expect(b["getMouseStateFromMouseHandler"](h, t)).toEqual(HoverState.Down);

    h["x"] = -1;
    h["y"] = -1;
    expect(b["getMouseStateFromMouseHandler"](h, t)).toEqual(HoverState.None);
  });

  it("Will get the proper color depending on HoverState", () => {
    const foreColor = Color.Red;
    const backColor = Color.Blue;
    const downColor = Color.Green;
    const hoverColor = Color.Yellow;
    const b = new ButtonWidget({
      initialState: {
        text: "Hello",
        foreColor,
        backColor,
        downColor,
        hoverColor,
      },
    });

    expect(b["getBackColor"](HoverState.None)).toEqual(backColor);
    expect(b["getBackColor"](HoverState.Hover)).toEqual(hoverColor);
    expect(b["getBackColor"](HoverState.Down)).toEqual(downColor);
    expect(b["getBackColor"](-1 as any)).toEqual(undefined);
  });

  it("can get a mouse click", () => {
    const h = new MouseHandler();
    const t = new MemoryTerminal({ width: 10, height: 10 });
    const b = new ButtonWidget({ initialState: { text: "Hello" } });

    const event: MouseHandlerEvent = {
      x: 0,
      y: 0,
      type: "mousedown",
      button: 0,
    };

    b.onMouseClick(event);
    b.setTerminal(t);
    b.onMouseClick(event);
    b.setState({ onClick: () => {} });

    expect(b.onMouseClick(event)).toEqual(true);
    event.x = -1;
    expect(b.onMouseClick(event)).toEqual(false);
  });
});
