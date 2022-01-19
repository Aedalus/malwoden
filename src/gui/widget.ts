import { Vector2 } from "../struct";
import * as Calc from "../calc";
import { MouseHandler, MouseHandlerEvent } from "../input";
import { Terminal } from "../malwoden";

/**
 * Generic used to create widget constructors.
 */
export interface WidgetConfig<S> {
  initialState: S;
  origin?: Vector2;
}

/**
 * Generic used to create widget updateFuncs
 */
export interface WidgetUpdateFunc<S> {
  (): Partial<S>;
}

/**
 * Passed through widgets for draw methods.
 */
export interface WidgetDrawCtx {
  terminal: Terminal.BaseTerminal;
  mouse?: MouseHandler;
}

/**
 * A Widget represents a reusable component able to draw to a terminal. These don't have to be used
 * if you prefer to directly write to the terminal itself, but can simplify the process. The abstract class
 * here contains basic shared methods related to Widgets, like adding/removing children, calculating
 * position, etc.
 *
 * While Malwoden provides several widgets out of the box, this class can be easily extended to make
 * custom widgets of all shapes and sizes.
 */
export abstract class Widget<S> {
  protected absoluteOrigin: Vector2;
  protected origin: Vector2 = { x: 0, y: 0 };
  protected updateFunc?: WidgetUpdateFunc<S>;
  protected parent?: Widget<any>;
  protected children: Widget<any>[] = [];
  protected state: S;
  protected disabled = false;

  /**
   * Creates a new Widget.
   * @param config - WidgetConfig
   */
  constructor(config: WidgetConfig<S>) {
    this.origin = config.origin ?? { x: 0, y: 0 };
    this.state = config.initialState;
    this.absoluteOrigin = this.origin;
    this.updateAbsoluteOrigin();
  }

  /**
   * Updates the absoluteOrigin position, called
   * whenever a widget's local origin has moved.
   */
  protected updateAbsoluteOrigin(): void {
    if (this.parent === undefined) {
      this.absoluteOrigin = { ...this.origin };
    } else {
      const parentAbs = this.parent.absoluteOrigin;
      this.absoluteOrigin = Calc.Vector.add(parentAbs, this.origin);
    }
    for (const c of this.children) {
      c.updateAbsoluteOrigin();
    }
  }

  /**
   * Adds the widget to a parent.
   * @param parent
   * @returns this - The child widget
   */
  setParent<T extends Widget<any>>(parent: T): this {
    parent.addChild(this);
    return this;
  }

  /**
   * Gets the current state of the widget. While not a copy, it's recommended to
   * use setState rather than mutate this object.
   * @returns
   */
  getState(): S {
    return this.state;
  }

  /**
   * Sets the state of the widget. Partial values allowed.
   * @param state Partial<S>
   * @returns - The widget
   */
  setState(state: Partial<S>): this {
    Object.assign(this.state, state);
    return this;
  }

  /**
   * Sets the local origin of the widget relative to it's parent,
   * then updates the absoluteOrigin of the widget
   * @param origin Vector2 - The position relative to its parent
   * @returns - The widget
   */
  setOrigin(origin: Vector2): this {
    this.origin = origin;
    this.updateAbsoluteOrigin();
    return this;
  }

  /**
   * Gets the local origin. This will be relative to the parent's origin.
   * @returns - Vector2
   */
  getOrigin(): Vector2 {
    return this.origin;
  }

  /**
   * Whether or not the widget will update/draw
   * @returns boolean
   */
  isDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Sets the disabled state.
   * @param disabled - Default true
   * @returns - The Widget
   */
  setDisabled(disabled: boolean = true): this {
    this.disabled = disabled;
    return this;
  }

  /**
   * Returns a Vector2 relative to true 0,0, which is usually the top left of the terminal.
   * @returns - Vector2
   */
  getAbsoluteOrigin(): Vector2 {
    return this.absoluteOrigin;
  }

  /**
   * Set a function to run whenever update or cascadeUpdate is called. Generally this is used
   * with closures/currying to transform game state to function state.
   * @param updateFunc - The function called on update
   * @returns The widget
   */
  setUpdateFunc(updateFunc: WidgetUpdateFunc<S>): this {
    this.updateFunc = updateFunc;
    return this;
  }

  /**
   * Clears the function run on update.
   * @returns The Widget
   */
  clearUpdateFunc(): this {
    this.updateFunc = undefined;
    return this;
  }

  /**
   * Transforms the given local position to an absolute position.
   * @param localPosition Vector2
   * @returns Vector2
   */
  localToAbsolute(localPosition: Vector2): Vector2 {
    return Calc.Vector.add(this.absoluteOrigin, localPosition);
  }

  /**
   * Transforms a given absolute position to one relative to the
   * widget's local origin.
   * @param absolutePosition Vector2
   * @returns Vector2
   */
  absoluteToLocal(absolutePosition: Vector2): Vector2 {
    return Calc.Vector.subtract(absolutePosition, this.absoluteOrigin);
  }

  /**
   * Adds a child widget to this widget. Removes any existing parent from the child first.
   * @param child - The child widget
   * @returns The child widget
   */
  addChild<T extends Widget<any>>(child: T): T {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    child.updateAbsoluteOrigin();
    this.children.push(child);
    return child;
  }

  /**
   * Removes a child widget from the parent widget.
   * @param child The child widget
   * @returns The child widget if found, undefined otherwise.
   */
  removeChild<T extends Widget<any>>(child: T): T | undefined {
    const newChildren: Widget<any>[] = [];
    let foundChild: Widget<any> | undefined;
    for (const c of this.children) {
      if (c !== child) {
        newChildren.push(c);
      } else {
        foundChild = c;
      }
    }
    this.children = newChildren;
    return foundChild as T;
  }

  /**
   * Calls update() for this widget and all children widgets recursively.
   * Children added last will be called last. If a widget is disabled, the update
   * will stop there.
   */
  cascadeUpdate(): void {
    if (this.isDisabled()) {
      return;
    }
    if (this.updateFunc) {
      const s = this.updateFunc();
      Object.assign(this.state, s);
    }
    for (const c of this.children) {
      c.cascadeUpdate();
    }
  }

  /**
   * Calls an updateFunc if previously given, and merges it into the
   * widgets state.
   */
  update(): void {
    if (this.isDisabled()) {
      return;
    }
    if (!this.updateFunc) return;
    const s = this.updateFunc();
    Object.assign(this.state, s);
  }

  /**
   * Calls the draw() method of this widget and all children widgets recursively.
   * If a widget is disabled it will stop the cascade.
   * @param ctx.terminal Terminal - A terminal to draw on
   * @param ctx.mouse MouseHandler - An optional mouse handler for computing position
   */
  cascadeDraw(ctx: WidgetDrawCtx): void {
    if (this.isDisabled()) return;
    this.draw(ctx);
    for (const c of this.children) {
      c.cascadeDraw(ctx);
    }
  }

  /**
   * Draws on to the given terminal using the widget's current state. Will not draw if disabled.
   * @param ctx.terminal Terminal - A terminal to draw on
   * @param ctx.mouse MouseHandler - An optional mouse handler for computing position
   * @returns
   */
  draw(ctx: WidgetDrawCtx): void {
    if (this.isDisabled()) return;
    this.onDraw(ctx);
  }

  cascadeClick(mouse: MouseHandlerEvent): boolean {
    if (this.isDisabled()) return false;
    for (let i = this.children.length - 1; i >= 0; i--) {
      const c = this.children[i];
      const captured = c.cascadeClick(mouse);
      if (captured) return true;
    }
    return this.click(mouse);
  }

  click(mouse: MouseHandlerEvent): boolean {
    if (this.isDisabled()) return false;
    return this.onClick(mouse);
  }

  /**
   * Will be fired on click() or cascadeClick(). Return 'true' to capture the event, which
   * will make it no longer cascade to other widgets. Return 'false' to pass the event to other widgets.
   * @param absolutePosition Vector2 - The absolute position of the rendering terminal
   * @returns boolean - Capture the event
   */
  onClick(mouse: MouseHandlerEvent): boolean {
    return false;
  }

  /**
   * A method to be implemented by widgets to render to the terminal.
   * @param ctx.terminal Terminal - A terminal to draw on
   * @param ctx.mouse MouseHandler - An optional mouse handler for computing position
   */
  abstract onDraw(ctx: WidgetDrawCtx): void;
}
