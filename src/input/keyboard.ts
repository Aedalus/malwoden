import { KeyCode } from "./keycode";

/**
 * Represents a global keyboard. Will likely only create one per app.
 *
 * You can bind/switch KeyboardContexts to the Keyboard handler
 * to change input 'modes'.
 */
export class KeyboardHandler {
  private context?: KeyboardContext;
  private _isDown = new Set<number>();

  /** Creates a new KeyboardHandler */
  constructor() {
    document.addEventListener("keydown", this.onKeyDownEvent.bind(this));
    document.addEventListener("keyup", this.onKeyUpEvent.bind(this));
  }

  private onKeyDownEvent(e: KeyboardEvent) {
    this._isDown.add(e.keyCode);
    this.context && this.context.fireOnDown(e.keyCode);
    e.stopPropagation();
  }

  private onKeyUpEvent(e: KeyboardEvent) {
    this._isDown.delete(e.keyCode);
    this.context && this.context.fireOnUp(e.keyCode);
    e.stopPropagation();
  }

  /**
   * Sets the active context of the keyboard handler.
   * @param context KeyboardContext - The context to use
   */
  setContext(context: KeyboardContext) {
    this.context = context;
  }

  /**
   * Clears the active context for the keyboard handler.
   */
  clearContext(): KeyboardContext | undefined {
    const existing = this.context;
    this.context = undefined;
    return existing;
  }

  /**
   * Returns if a key is currently held down.
   * @param keyCode KeyCode | number - The keyCode to check
   */
  isKeyDown(keyCode: number): boolean {
    return this._isDown.has(keyCode);
  }
}

type ContextCallback = () => void;

/** Represents a keyboard 'mode', like navigating a menu or world. */
export class KeyboardContext {
  private _onDown = new Map<number, ContextCallback>();
  private _onUp = new Map<number, ContextCallback>();

  /**
   * Fires callback on KeyDown
   * @param key KeyCode | number - The Key to monitor
   * @param callback () => void - The callback
   */
  onDown(key: KeyCode | number, callback: ContextCallback): KeyboardContext {
    this._onDown.set(key, callback);
    return this;
  }

  /**
   * Fires callback on KeyUp
   * @param key KeyCode | number - The Key to monitor
   * @param callback () => void - The callback
   */
  onUp(key: KeyCode | number, callback: ContextCallback): KeyboardContext {
    this._onUp.set(key, callback);
    return this;
  }

  /**
   * Programmatically fire a callback as if a key was pressed.
   * @param key KeyCode | number - The Key to monitor
   */
  fireOnDown(key: KeyCode | number) {
    const fn = this._onDown.get(key);
    if (fn) fn();
  }

  /**
   * Programmatically fire a callback as if a key was lifted.
   * @param key KeyCode | number - The Key to monitor
   */
  fireOnUp(key: KeyCode | number) {
    const fn = this._onUp.get(key);
    if (fn) fn();
  }
}
