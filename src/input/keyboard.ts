import { timeStamp } from "console";
import { KeyCode } from "./keycode";

export class KeyboardHandler {
  private context?: KeyboardContext;

  isDown: Map<string, boolean> = new Map();

  constructor() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      this.context && this.context.fireOnDown(e.keyCode);
      e.preventDefault();
    });
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      this.context && this.context.fireOnUp(e.keyCode);
      e.preventDefault();
    });
  }

  setContext(context: KeyboardContext) {
    this.context = context;
  }
  clearContext(): KeyboardContext | undefined {
    const existing = this.context;
    this.context = undefined;
    return existing;
  }
  isPressed(key: KeyCode | number) {
    return this.isDown.get(key.toString());
  }
}

type ContextCallback = () => void;
export class KeyboardContext {
  private _onDown = new Map<number, ContextCallback>();
  private _onUp = new Map<number, ContextCallback>();

  onDown(key: KeyCode | number, callback: ContextCallback) {
    this._onDown.set(key, callback);
  }
  onUp(key: KeyCode | number, callback: ContextCallback) {
    this._onUp.set(key, callback);
  }

  fireOnDown(key: KeyCode | number) {
    const fn = this._onDown.get(key);
    if (fn) fn();
  }

  fireOnUp(key: KeyCode | number) {
    const fn = this._onUp.get(key);
    if (fn) fn();
  }
}
