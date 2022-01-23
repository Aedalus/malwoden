import { Vector2 } from "../struct";

export interface MouseContextCallback {
  (pos: MouseHandlerEvent): void;
}

export interface MouseHandlerEvent {
  x: number;
  y: number;
  button: number;
  type: "mousedown" | "mouseup";
}

/**
 * Represents a global mouse. Will likely only create one per app.
 *
 * You can bind/switch MouseContexts to the MouseHandler
 * to change input 'modes'.
 */
export class MouseHandler {
  private x: number = 0;
  private y: number = 0;

  private context?: MouseContext;
  private _isDown = new Set<number>();

  /** Creates a new Mouse Handler */
  constructor() {
    document.addEventListener(
      "mousemove",
      this.onMouseUpdateEvent.bind(this),
      false
    );
    document.addEventListener(
      "mouseenter",
      this.onMouseUpdateEvent.bind(this),
      false
    );

    document.addEventListener("mousedown", this.onMouseDownEvent.bind(this));
    document.addEventListener("mouseup", this.onMouseUpEvent.bind(this));
  }

  private onMouseDownEvent(e: MouseEvent) {
    this._isDown.add(e.button);
    if (this.context) {
      const x = e.clientX;
      const y = e.clientY;
      this.context.callOnMouseDown({
        x,
        y,
        button: e.button,
        type: "mousedown",
      });
    }
  }

  private onMouseUpEvent(e: MouseEvent) {
    this._isDown.delete(e.button);
    if (this.context) {
      const x = e.clientX;
      const y = e.clientY;
      this.context.callOnMouseUp({ x, y, button: e.button, type: "mouseup" });
    }
  }

  private onMouseUpdateEvent(e: MouseEvent) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  /**
   * Returns true if the given mouse button is down.
   * @param mouseButton number - Default 0 for left click.
   */
  isMouseDown(mouseButton: number = 0): boolean {
    return this._isDown.has(mouseButton);
  }

  /**
   * Gets the current position of the mouse
   * @returns Vector2
   */
  getPos(): Vector2 {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Sets the active mouse context
   * @param context MouseContext
   * @returns this
   */
  setContext(context: MouseContext): this {
    this.context = context;
    return this;
  }

  /**
   * Clears the active mouse context
   * @returns this
   */
  clearContext(): this {
    this.context = undefined;
    return this;
  }
}

/**
 * MouseContext represents a single 'mode' of the game's mouse controls.
 * For instance, you might have one context to use for the overworld, another for
 * menus, another for inventory, etc.
 *
 * You can set the active context through a MouseHandler's setContext(ctx)
 * and clearContext() methods.
 *
 *
 * You can register multiple callbacks for onUp/onDown.
 */
export class MouseContext {
  private _onDown: MouseContextCallback[] = [];
  private _onUp: MouseContextCallback[] = [];

  /**
   * Registers a callback for a mousedown event.
   * @param callback - The function to call on mousedown
   * @return this
   */
  onMouseDown(callback: MouseContextCallback): this {
    this._onDown.push(callback);
    return this;
  }

  /**
   * Registers a callback for a mouseup event.
   * @param callback - The function to call on mousedown
   * @return this
   */
  onMouseUp(callback: MouseContextCallback): this {
    this._onUp.push(callback);
    return this;
  }

  /**
   * Clears a registered function for mousedown. If no callback is provided will clear all.
   * @param callback - The callback to clear.
   */
  clearMouseDown(callback?: MouseContextCallback): this {
    if (callback) {
      this._onDown = this._onDown.filter((x) => x !== callback);
    } else {
      this._onDown = [];
    }
    return this;
  }

  /**
   * Clears a registered function for mouseup. If no callback is provided will clear all.
   * @param callback - The callback to clear.
   */
  clearMouseUp(callback?: MouseContextCallback): this {
    if (callback) {
      this._onUp = this._onUp.filter((x) => x !== callback);
    } else {
      this._onUp = [];
    }
    return this;
  }

  /**
   * Invokes a registered callback for mousedown
   * @param e MouseHandlerEvent
   */
  callOnMouseDown(e: MouseHandlerEvent) {
    for (const f of this._onDown) {
      f(e);
    }
  }

  /**
   * Invokes a registered callback for mouseup
   * @param e MouseHandlerEvent
   */
  callOnMouseUp(e: MouseHandlerEvent) {
    for (const f of this._onUp) {
      f(e);
    }
  }
}
