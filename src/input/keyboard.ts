import { KeyCode } from "./keycode";

export interface KeyContextCallback {
  (event: KeyHandlerEvent): void;
}

export interface KeyHandlerEvent {
  key: KeyCode;
  repeat: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  event: "keydown" | "keyup";
}

/**
 * Represents a global keyboard. Will likely only create one per app.
 *
 * You can bind/switch KeyboardContexts to the Keyboard handler
 * to change input 'modes'.
 */
export class KeyboardHandler {
  private _context?: KeyboardContext;
  private _isDown = new Set<number>();

  private _stopPropagation: boolean;

  /** Creates a new KeyboardHandler */
  constructor(config?: { stopPropagation: boolean }) {
    this._stopPropagation = config?.stopPropagation ?? true;

    document.addEventListener("keydown", this.onKeyDownEvent.bind(this));
    document.addEventListener("keyup", this.onKeyUpEvent.bind(this));
  }

  private static keyEventFromDomEvent(
    event: "keyup" | "keydown",
    e: KeyboardEvent
  ): KeyHandlerEvent {
    return {
      key: e.keyCode,
      repeat: e.repeat,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      event,
    };
  }

  private _checkPropagation(e: KeyboardEvent): boolean {
    if (this._stopPropagation) {
      e.stopPropagation();
      return true;
    }
    return false;
  }

  private onKeyDownEvent(e: KeyboardEvent) {
    this._isDown.add(e.keyCode);
    this._context &&
      this._context.callOnDown(
        KeyboardHandler.keyEventFromDomEvent("keydown", e)
      );
    this._checkPropagation(e);
  }

  private onKeyUpEvent(e: KeyboardEvent) {
    this._isDown.delete(e.keyCode);
    this._context &&
      this._context.callOnUp(KeyboardHandler.keyEventFromDomEvent("keyup", e));
    this._checkPropagation(e);
  }

  /**
   * Sets the active context of the keyboard handler.
   * @param context KeyboardContext - The context to use
   */
  setContext(context: KeyboardContext) {
    this._context = context;
  }

  /**
   * Clears the active context for the keyboard handler.
   */
  clearContext(): KeyboardContext | undefined {
    const existing = this._context;
    this._context = undefined;
    return existing;
  }

  /**
   * Returns if a key is currently held down.
   * @param keyCode KeyCode | number - The keyCode to check
   */
  isKeyDown(keyCode: number): boolean {
    return this._isDown.has(keyCode);
  }

  /**
   * Returns a promise that will resolve the next time a given keyCode is released.
   * If no keyCode is given, it will return the next keyCode released.
   * @param keyCode - The keyCode to listen to. If not provided, will monitor for any keycode.
   * @returns - The pressed keyCode.
   */
  async waitForKeyUp(keyCode?: number): Promise<number> {
    return new Promise((resolve) => {
      const listener = (e: KeyboardEvent) => {
        if (keyCode === undefined || keyCode === e.keyCode) {
          document.removeEventListener("keyup", listener);
          resolve(e.keyCode);
        }
      };
      document.addEventListener("keyup", listener);
    });
  }

  /**
   * Returns a promise that will resolve the next time a given keyCode is pressed down. If
   * no keyCode is given, it will return the next keyCode pressed.
   * @param keyCode
   * @returns - The pressed keyCode.
   */
  async waitForKeyDown(keyCode?: number): Promise<number> {
    return new Promise((resolve) => {
      const listener = (e: KeyboardEvent) => {
        if (keyCode === undefined || keyCode === e.keyCode) {
          document.removeEventListener("keydown", listener);
          resolve(e.keyCode);
        }
      };
      document.addEventListener("keydown", listener);
    });
  }
}

/**
 * KeyboardContext represents a single 'mode' of the game's keyboard controls.
 * For instance, you might have one context to use for the overworld, another for
 * menus, another for inventory, etc.
 *
 * You can set the active context through a KeyboardHandler's setContext(ctx)
 * and clearContext() methods.
 *
 * Normally the onDown/onUp callbacks can be used to listen for specific keys,
 * but for more control onAnyDown/onAnyUp can be used to register callbacks
 * that fire on any key press. These 'any' callbacks will always be the first
 * to be called during a new key press.
 *
 * You can register multiple 'any' callbacks or key-specific callbacks for rare
 * patterns,for instance registering 2 callbacks to fire when the 'E' key is
 * pressed, etc.
 */
export class KeyboardContext {
  private _onDown = new Map<number | string, KeyContextCallback[]>();
  private _onUp = new Map<number | string, KeyContextCallback[]>();

  private _anyKey = "any";

  private _getOnDownFns(key: number | string): KeyContextCallback[] {
    return this._onDown.get(key) ?? [];
  }
  private _getOnUpFns(key: number | string): KeyContextCallback[] {
    return this._onUp.get(key) ?? [];
  }
  private _addOnDown(key: number | string, callback: KeyContextCallback) {
    const existing = this._getOnDownFns(key);
    existing.push(callback);
    this._onDown.set(key, existing);
  }

  private _addOnUp(key: number | string, callback: KeyContextCallback) {
    const existing = this._getOnUpFns(key);
    existing.push(callback);
    this._onUp.set(key, existing);
  }

  /**
   * Fires callback on a specific key down. Can call multiple times to register multiple callbacks.
   * @param key KeyCode | number - The Key to monitor
   * @param callback (KeyHandlerEvent) => void - The callback
   * @returns - The KeyboardContext
   */
  onDown(key: KeyCode | number, callback: KeyContextCallback): KeyboardContext {
    this._addOnDown(key, callback);
    return this;
  }

  /**
   * Clear an existing callback for a key. If no callback is provided, will clear
   * all callbacks on that key.
   * @param key KeyCode - The keycode to clear onDown.
   * @param callback If no existing event is provided, will clear all
   */
  clearOnDown(key: KeyCode | number, callback?: KeyContextCallback) {
    const filtered = callback
      ? this._getOnDownFns(key).filter((f) => f !== callback)
      : [];
    this._onDown.set(key, filtered);
  }

  /**
   * Fires callback on any key down. Can call multiple times to register multiple callbacks.
   * @param callback (KeyHandlerEvent) => void - The callback
   * @returns - The KeyboardContext
   */
  onAnyDown(callback: KeyContextCallback): KeyboardContext {
    this._addOnDown(this._anyKey, callback);
    return this;
  }

  /**
   * Clear a callback listening for any key. If no callback is provided, will clear
   * all callbacks on listening for any keys.
   * @param callback If no existing event is provided, will clear all
   */
  clearOnAnyDown(callback?: KeyContextCallback) {
    const filtered = callback
      ? this._getOnDownFns(this._anyKey).filter((f) => f !== callback)
      : [];
    this._onDown.set(this._anyKey, filtered);
  }

  /**
   * Fires callback on a specific key up. Can call multiple times to register multiple callbacks.
   * @param key KeyCode | number - The Key to monitor
   * @param callback (KeyHandlerEvent) => void - The callback
   * @returns - The KeyboardContext
   */
  onUp(key: KeyCode | number, callback: KeyContextCallback): KeyboardContext {
    this._addOnUp(key, callback);
    return this;
  }

  /**
   * Clear an existing callback for a key. If no callback is provided, will clear
   * all callbacks on that key.
   * @param key KeyCode - The keycode to clear onUp.
   * @param callback If no existing event is provided, will clear all
   */
  clearOnUp(key: KeyCode | number, callback?: KeyContextCallback) {
    const filtered = callback
      ? this._getOnUpFns(key).filter((f) => f !== callback)
      : [];
    this._onUp.set(key, filtered);
  }

  /**
   * Fires callback on any key up. Can call multiple times to register multiple callbacks.
   * @param callback (KeyHandlerEvent) => void - The callback
   * @returns - The KeyboardContext
   */
  onAnyUp(callback: KeyContextCallback): KeyboardContext {
    this._addOnUp(this._anyKey, callback);
    return this;
  }

  /**
   * Clear a callback listening for any key. If no callback is provided, will clear
   * all callbacks on listening for any keys.
   * @param callback If no existing event is provided, will clear all
   */
  clearOnAnyUp(callback?: KeyContextCallback) {
    const filtered = callback
      ? this._getOnUpFns(this._anyKey).filter((f) => f !== callback)
      : [];
    this._onUp.set(this._anyKey, filtered);
  }

  /**
   * Programmatically call all callbacks as if a key was pressed.
   * @param key KeyHandlerEvent
   */
  callOnDown(event: KeyHandlerEvent) {
    const anyFns = this._onDown.get(this._anyKey) ?? [];
    const fns = this._onDown.get(event.key) ?? [];
    for (const f of anyFns) {
      f(event);
    }
    for (const f of fns) {
      f(event);
    }
  }

  /**
   * Programmatically call all callbacks as if a key was lifted.
   * @param key KeyHandlerEvent
   */
  callOnUp(event: KeyHandlerEvent) {
    const anyFns = this._onUp.get(this._anyKey) ?? [];
    const fns = this._onUp.get(event.key) ?? [];
    for (const f of anyFns) {
      f(event);
    }
    for (const f of fns) {
      f(event);
    }
  }
}
