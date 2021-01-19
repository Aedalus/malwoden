import { JSDOM } from "jsdom";
import { KeyboardHandler, KeyboardContext } from "./keyboard";
import { KeyCode } from "./keycode";

describe("KeyboardHandler", () => {
  beforeEach(() => {
    const dom = new JSDOM();
    //@ts-ignore
    global.document = dom.window.document;
    //@ts-ignore
    global.window = dom.window;
    //@ts-ignore
    global.KeyboardEvent = dom.window.KeyboardEvent;
  });

  it("Will listen to keyboard events", () => {
    const h = new KeyboardHandler();
    const c = new KeyboardContext();

    let down = 0;
    let up = 0;

    c.onDown(KeyCode.A, () => {
      down++;
    });
    c.onUp(KeyCode.A, () => {
      up++;
    });

    h.setContext(c);

    var event = new KeyboardEvent("keydown", { keyCode: KeyCode.A });
    document.dispatchEvent(event);

    expect(down).toEqual(1);
    expect(up).toEqual(0);

    var event = new KeyboardEvent("keyup", { keyCode: KeyCode.A });
    document.dispatchEvent(event);

    expect(down).toEqual(1);
    expect(up).toEqual(1);
  });

  it("Can set a context", () => {
    const h = new KeyboardHandler();
    const c = new KeyboardContext();

    h.setContext(c);
    expect(h["context"]).toBe(c);
  });

  it("Can clear a context", () => {
    const h = new KeyboardHandler();
    const c = new KeyboardContext();

    h.setContext(c);
    expect(h["context"]).toBe(c);

    h.clearContext();
    expect(h["context"]).toBeUndefined();
  });

  it("Can check if a key is down", () => {
    const h = new KeyboardHandler();
    const _isDown = h["_isDown"];

    expect(h["_isDown"].has(KeyCode.A)).toBeFalsy();
    expect(h.isKeyDown(KeyCode.A)).toBeFalsy();
    h["onKeyDownEvent"](new KeyboardEvent("keydown", { keyCode: KeyCode.A }));
    expect(h["_isDown"].has(KeyCode.A)).toBeTruthy();
    expect(h.isKeyDown(KeyCode.A)).toBeTruthy();

    h["onKeyUpEvent"](new KeyboardEvent("keyup", { keyCode: KeyCode.A }));
    expect(h["_isDown"].has(KeyCode.A)).toBeFalsy();
    expect(h.isKeyDown(KeyCode.A)).toBeFalsy();
  });

  it("Can fire onDown", () => {
    const c = new KeyboardContext();

    let count = 0;

    c.onDown(KeyCode.A, () => count++);

    c.fireOnDown(KeyCode.A);
    c.fireOnDown(KeyCode.A);
    c.fireOnDown(KeyCode.A);

    expect(count).toEqual(3);
  });

  it("Can fire onUp", () => {
    const c = new KeyboardContext();

    let count = 0;

    c.onUp(KeyCode.A, () => count++);

    c.fireOnUp(KeyCode.A);
    c.fireOnUp(KeyCode.A);
    c.fireOnUp(KeyCode.A);

    expect(count).toEqual(3);
  });

  it("Won't error on unregistered keys", () => {
    const c = new KeyboardContext();

    c.fireOnUp(KeyCode.A);
    c.fireOnDown(KeyCode.A);
  });
});
