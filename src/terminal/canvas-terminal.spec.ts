import { JSDOM } from "jsdom";
import { CharCode } from "./char-code";
import { Color } from "./color";
import { Glyph } from "./glyph";
import { CanvasTerminal, Font } from "./canvas-terminal";

describe("RetroTerminal", () => {
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

  it("Can be created with a font", () => {
    const font = new Font("Courier", 24);
    const terminal = new CanvasTerminal({
      width: 20,
      height: 10,
      font,
    });
  });

  it("Can be mounted to a node", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    expect(div.childNodes).toHaveLength(0);
    const font = new Font("Courier", 24);
    const terminal = new CanvasTerminal({
      width: 20,
      height: 10,
      font,
      mountNode: div,
    });

    expect(div.childNodes).toHaveLength(1);
  });

  //   it("Won't render until the font is loaded", () => {
  //     const term = new RetroTerminal({
  //       width: 10,
  //       height: 10,
  //       charWidth: 10,
  //       charHeight: 10,
  //       imageURL: "/public/tilemap.png",
  //     });
  //     //@ts-ignore
  //     const spy = jest.spyOn(term, "getColorFont");
  //     term.render();
  //     expect(spy).not.toHaveBeenCalled();
  //   });

  //   it("Will render once the font is loaded", () => {
  //     const term = new RetroTerminal({
  //       width: 10,
  //       height: 10,
  //       charWidth: 10,
  //       charHeight: 10,
  //       imageURL: "/public/tilemap.png",
  //     });
  //     const spy = jest.spyOn(term, "render");

  //     expect(spy).not.toHaveBeenCalled();
  //     const onLoadFunc = term["_font"].onload!;
  //     expect(onLoadFunc).toBeTruthy();
  //     //@ts-ignore
  //     onLoadFunc();
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });

  it("Can render", () => {
    const font = new Font("Courier", 24);
    const term = new CanvasTerminal({
      width: 20,
      height: 10,
      font,
    });

    // Will cache red
    term.drawCharCode({ x: 0, y: 0 }, 102, Color.Red);

    // The Green will be ignore, overriden by blue
    term.drawCharCode({ x: 1, y: 0 }, 102, Color.Green);
    term.drawCharCode({ x: 1, y: 0 }, 102, Color.Blue);

    // Only need one copy of yellow, 3 total
    term.drawCharCode({ x: 2, y: 0 }, 102, Color.Yellow);
    term.drawGlyph(
      { x: 3, y: 0 },
      Glyph.fromCharCode(CharCode.whiteSmilingFace, Color.Yellow)
    );

    // Spaces are ignored
    term.drawGlyph({ x: 5, y: 0 }, new Glyph(" ", Color.Purple));

    term.render();
  });

  it("Can be destroyed", () => {
    const font = new Font("Courier", 24);
    const term = new CanvasTerminal({
      width: 20,
      height: 10,
      font,
    });

    expect(window.document.body.childNodes).toHaveLength(1);
    term.delete();
    expect(window.document.body.childNodes).toHaveLength(0);

    // Ensure it won't error on recalls
    term.delete();
  });

  it("Can get pixel to char", () => {
    const font = new Font("Courier", 24);
    const term = new CanvasTerminal({
      width: 20,
      height: 20,
      font,
    });
    term["charWidth"] = 16;
    const pos = term.pixelToChar({ x: 16, y: 25 });

    expect(pos).toEqual({ x: 1, y: 1 });
  });
});
