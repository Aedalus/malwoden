import { Vector2 } from "../util";

interface MouseCallback {
  (pos: Vector2): void;
}

/** Abstracts browser mouse input */
export class MouseHandler {
  private x: number = 0;
  private y: number = 0;

  private context?: MouseContext;

  /** Creates a new Mouse Handler */
  constructor() {
    document.addEventListener(
      "mousemove",
      this.onMouseUpdate.bind(this),
      false
    );
    document.addEventListener(
      "mouseenter",
      this.onMouseUpdate.bind(this),
      false
    );

    document.addEventListener("mousedown", (e) => {
      if (this.context) {
        const x = e.pageX;
        const y = e.pageY;
        this.context.callOnMouseDown({ x, y }, e.button);
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (this.context) {
        const x = e.pageX;
        const y = e.pageY;
        this.context.callOnMouseUp({ x, y }, e.button);
      }
    });
  }

  private onMouseUpdate(e: MouseEvent) {
    this.x = e.pageX;
    this.y = e.pageY;
  }

  /** Gets the current window position of the mouse */
  getPos(): Vector2 {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Sets the active mouse context
   * @param context MouseContext
   */
  setContext(context: MouseContext) {
    this.context = context;
  }

  /** Clears the active mouse context */
  clearContext() {
    this.context = undefined;
  }
}

export class MouseContext {
  private onDown = new Map<number, MouseCallback>();
  private onUp = new Map<number, MouseCallback>();

  /**
   * Registers a callback for a mousedown event
   * @param callback - The function to call on mousedown
   * @param mouseButton - The mouse button number. Default 0 for left click.
   */
  onMouseDown(callback: MouseCallback, mouseButton: number = 0): MouseContext {
    this.onDown.set(mouseButton, callback);
    return this;
  }

  /**
   * Registers a callback for a mouseup event
   * @param callback - The function to call on mouseup
   * @param mouseButton - The mouse button number. Default 0 for left click.
   */
  onMouseUp(callback: MouseCallback, mouseButton: number = 0): MouseContext {
    this.onUp.set(mouseButton, callback);
    return this;
  }

  /**
   * Clears a registered function for mousedown
   * @param mouseButton - The mouse button to clear. Default 0 for left click.
   */
  clearMouseDown(mouseButton: number = 0) {
    this.onDown.delete(mouseButton);
  }

  /**
   * Clears a registered function for mouseup
   * @param mouseButton - The mouse button to clear. Default 0 for left click.
   */
  clearMouseUp(mouseButton: number = 0) {
    this.onUp.delete(mouseButton);
  }

  /**
   * Invokes a registered callback for mousedown
   * @param pos Vector2 - The pos for the mouse
   * @param mouseButton - The mouse button pressed
   */
  callOnMouseDown(pos: Vector2, mouseButton: number = 0) {
    const callback = this.onDown.get(mouseButton);
    if (callback) callback(pos);
  }

  /**
   * Invokes a registered callback for mouseup
   * @param pos
   * @param mouseButton
   */
  callOnMouseUp(pos: Vector2, mouseButton: number = 0) {
    const callback = this.onUp.get(mouseButton);
    if (callback) callback(pos);
  }
}
