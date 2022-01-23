import { JSDOM } from "jsdom";

export function setupTestDom() {
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
}

describe("setupTestDom", () => {
  it("won't error on setup", () => {
    expect(() => setupTestDom()).not.toThrow();
  });
});
