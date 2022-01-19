import { JSDOM } from "jsdom";
import { KeyHandlerEvent } from ".";
import { KeyboardHandler, KeyboardContext } from "./keyboard";
import { KeyCode } from "./keycode";

function keyEventFromKey(
  event: "keyup" | "keydown",
  key: KeyCode
): KeyHandlerEvent {
  return {
    key,
    ctrlKey: false,
    metaKey: false,
    repeat: false,
    shiftKey: false,
    event,
  };
}

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
    expect(h["_context"]).toBe(c);
  });

  it("Can clear a context", () => {
    const h = new KeyboardHandler();
    const c = new KeyboardContext();

    h.setContext(c);
    expect(h["_context"]).toBe(c);

    h.clearContext();
    expect(h["_context"]).toBeUndefined();
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

    c.callOnDown(keyEventFromKey("keydown", KeyCode.A));
    c.callOnDown(keyEventFromKey("keydown", KeyCode.A));
    c.callOnDown(keyEventFromKey("keydown", KeyCode.A));

    expect(count).toEqual(3);
  });

  it("Can fire onUp", () => {
    const c = new KeyboardContext();

    let count = 0;

    c.onUp(KeyCode.A, () => count++);

    c.callOnUp(keyEventFromKey("keyup", KeyCode.A));
    c.callOnUp(keyEventFromKey("keyup", KeyCode.A));
    c.callOnUp(keyEventFromKey("keyup", KeyCode.A));

    expect(count).toEqual(3);
  });

  it("Won't error on unregistered keys", () => {
    const c = new KeyboardContext();

    c.callOnUp(keyEventFromKey("keyup", KeyCode.A));
    c.callOnDown(keyEventFromKey("keydown", KeyCode.A));
  });

  it("Can wait for a keyDown", async () => {
    const k = new KeyboardHandler();

    let promise = k.waitForKeyDown();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.A })
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.B })
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.C })
    );

    const keyDown = await promise;
    expect(keyDown).toEqual(KeyCode.A);

    let promise2 = k.waitForKeyDown(KeyCode.B);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.A })
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.B })
    );

    const keyDown2 = await promise2;
    expect(keyDown2).toEqual(KeyCode.B);
  });

  it("Can wait for a keyUp", async () => {
    const k = new KeyboardHandler();

    let promise = k.waitForKeyUp();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.B })
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: KeyCode.C })
    );
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: KeyCode.A }));
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: KeyCode.B }));
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: KeyCode.C }));

    const keyDown = await promise;
    expect(keyDown).toEqual(KeyCode.A);

    let promise2 = k.waitForKeyUp(KeyCode.B);
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: KeyCode.A }));
    document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: KeyCode.B }));

    const keyDown2 = await promise2;
    expect(keyDown2).toEqual(KeyCode.B);
  });

  it("Will call 'any' callbacks before specific callbacks", () => {
    const state = {
      downAny: "init",
      upAny: "init",
      down: "init",
      up: "init",
    };
    const c = new KeyboardContext()
      .onAnyUp(() => (state.upAny = "any"))
      .onAnyDown(() => (state.downAny = "any"))
      .onDown(KeyCode.A, () => (state.down = "specific"))
      .onUp(KeyCode.A, () => (state.up = "specific"));

    c.callOnDown(keyEventFromKey("keydown", KeyCode.A));
    expect(state).toEqual({
      downAny: "any",
      upAny: "init",
      down: "specific",
      up: "init",
    });

    c.callOnUp(keyEventFromKey("keyup", KeyCode.A));
    expect(state).toEqual({
      downAny: "any",
      upAny: "any",
      down: "specific",
      up: "specific",
    });
  });

  it("can be configured to stop propagation", () => {
    const h = new KeyboardHandler({ stopPropagation: true });
    const h2 = new KeyboardHandler({ stopPropagation: false });

    expect(h["_checkPropagation"](new KeyboardEvent("keydown"))).toEqual(true);

    expect(h2["_checkPropagation"](new KeyboardEvent("keydown"))).toEqual(
      false
    );
  });

  it("can add multiple callbacks - onDown", () => {
    const c = new KeyboardContext();
    const callbackA = () => {};
    const callbackB = () => {};

    c["_addOnDown"]("any", callbackA);
    c["_addOnDown"]("any", callbackB);

    c["_addOnDown"](KeyCode.A, callbackA);
    c["_addOnDown"](KeyCode.A, callbackB);

    expect(c["_onDown"].get("any")).toEqual([callbackA, callbackB]);
    expect(c["_onDown"].get(KeyCode.A)).toEqual([callbackA, callbackB]);
    expect(c["_onDown"].get(KeyCode.B)).toBeUndefined();
  });

  it("can add multiple callbacks - onUp", () => {
    const c = new KeyboardContext();
    const callbackA = () => {};
    const callbackB = () => {};

    c["_addOnUp"]("any", callbackA);
    c["_addOnUp"]("any", callbackB);

    c["_addOnUp"](KeyCode.A, callbackA);
    c["_addOnUp"](KeyCode.A, callbackB);

    expect(c["_onUp"].get("any")).toEqual([callbackA, callbackB]);
    expect(c["_onUp"].get(KeyCode.A)).toEqual([callbackA, callbackB]);
    expect(c["_onUp"].get(KeyCode.B)).toBeUndefined();
  });

  it("can clear callbacks for specific keys", () => {
    const c = new KeyboardContext();
    const f1 = () => {};
    const f2 = () => {};
    const f3 = () => {};
    const f4 = () => {};

    c.onDown(KeyCode.A, f1);
    c.onDown(KeyCode.A, f2);

    c.onUp(KeyCode.B, f3);
    c.onUp(KeyCode.B, f4);

    expect(c["_onDown"].get(KeyCode.A)).toEqual([f1, f2]);
    expect(c["_onUp"].get(KeyCode.B)).toEqual([f3, f4]);

    c.clearOnDown(KeyCode.A, f1);
    c.clearOnUp(KeyCode.B, f3);

    expect(c["_onDown"].get(KeyCode.A)).toEqual([f2]);
    expect(c["_onUp"].get(KeyCode.B)).toEqual([f4]);

    c.clearOnDown(KeyCode.A);
    c.clearOnUp(KeyCode.B);

    expect(c["_onDown"].get(KeyCode.A)).toEqual([]);
    expect(c["_onUp"].get(KeyCode.B)).toEqual([]);
  });

  it("can clear callbacks for 'any' keys", () => {
    const c = new KeyboardContext();
    const f1 = () => {};
    const f2 = () => {};
    const f3 = () => {};
    const f4 = () => {};

    c.onAnyDown(f1);
    c.onAnyDown(f2);

    c.onAnyUp(f3);
    c.onAnyUp(f4);

    expect(c["_onDown"].get("any")).toEqual([f1, f2]);
    expect(c["_onUp"].get("any")).toEqual([f3, f4]);

    c.clearOnAnyDown(f1);
    c.clearOnAnyUp(f3);

    expect(c["_onDown"].get("any")).toEqual([f2]);
    expect(c["_onUp"].get("any")).toEqual([f4]);

    c.clearOnAnyDown();
    c.clearOnAnyUp();

    expect(c["_onDown"].get("any")).toEqual([]);
    expect(c["_onUp"].get("any")).toEqual([]);
  });
});
