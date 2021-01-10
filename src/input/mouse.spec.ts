import { JSDOM } from "jsdom";
import { MouseHandler } from "./mouse";

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

    m["onMouseUpdate"]({
      pageX: 5,
      pageY: 10,
    } as MouseEvent);

    expect(m.getPos()).toEqual({ x: 5, y: 10 });
  });
});
