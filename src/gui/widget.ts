import { Vector2 } from "../struct";
import * as Calc from "../calc";
import { MouseHandler } from "../input";
import { Terminal } from "../malwoden";

export interface WidgetConfig<S> {
  initialState: S;
  origin?: Vector2;
}

export interface WidgetUpdateFunc<W, S, D> {
  (data: D, widget: W): Partial<S>;
}

export interface WidgetDrawCtx {
  terminal: Terminal.BaseTerminal;
  mouse?: MouseHandler;
}

export interface WidgetMouseEvent {
  x: number;
  y: number;
  button: number;
  type: "mousedown" | "mouseup";
}

export abstract class Widget<S, D> {
  protected absoluteOrigin: Vector2;
  protected origin: Vector2 = { x: 0, y: 0 };
  protected updateFunc?: WidgetUpdateFunc<this, S, D>;
  protected parent?: Widget<any, D>;
  protected children: Widget<any, D>[] = [];
  protected state: S;
  protected disabled = false;

  constructor(config: WidgetConfig<S>) {
    this.origin = config.origin ?? { x: 0, y: 0 };
    this.state = config.initialState;
    this.absoluteOrigin = this.origin;
    this.updateAbsoluteOrigin();
  }

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

  setParent(newParent: Widget<any, D>): this {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    newParent.addChild(this);
    return this;
  }

  getState(): S {
    return this.state;
  }

  setState(state: Partial<S>): this {
    Object.assign(this.state, state);
    return this;
  }

  setOrigin(origin: Vector2): this {
    this.origin = origin;
    this.updateAbsoluteOrigin();
    return this;
  }

  getOrigin(): Vector2 {
    return this.origin;
  }

  isDisabled(): boolean {
    return this.disabled;
  }

  setDisabled(disabled: boolean = true): this {
    this.disabled = disabled;
    return this;
  }

  getAbsoluteOrigin(): Vector2 {
    return this.absoluteOrigin;
  }

  setUpdateFunc(updateFunc: WidgetUpdateFunc<this, S, D>): this {
    this.updateFunc = updateFunc;
    return this;
  }

  clearUpdateFunc(): void {
    this.updateFunc = undefined;
  }

  localToAbsolute(localPosition: Vector2): Vector2 {
    return Calc.Vector.add(this.absoluteOrigin, localPosition);
  }

  absoluteToLocal(absolutePosition: Vector2): Vector2 {
    return Calc.Vector.subtract(absolutePosition, this.absoluteOrigin);
  }

  addChild<T extends Widget<any, D>>(child: T): T {
    child.parent = this;
    child.updateAbsoluteOrigin();
    this.children.push(child);
    return child;
  }

  removeChild<T extends Widget<any, D>>(child: T): T | undefined {
    const newChildren: Widget<any, D>[] = [];
    let foundChild: Widget<any, D> | undefined;
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

  cascadeUpdate(data: D): void {
    if (this.updateFunc) {
      const s = this.updateFunc(data, this);
      Object.assign(this.state, s);
    }
    for (const c of this.children) {
      c.cascadeUpdate(data);
    }
  }

  update(data: D): void {
    if (!this.updateFunc) return;
    const s = this.updateFunc(data, this);
    Object.assign(this.state, s);
  }

  cascadeDraw(ctx: WidgetDrawCtx): void {
    if (this.isDisabled()) return;
    this.draw(ctx);
    for (const c of this.children) {
      c.cascadeDraw(ctx);
    }
  }

  draw(ctx: WidgetDrawCtx): void {
    if (this.isDisabled()) return;
    this.onDraw(ctx);
  }

  abstract onDraw(ctx: WidgetDrawCtx): void;

  cascadeClick(mouse: WidgetMouseEvent): boolean {
    if (this.isDisabled()) return false;
    for (let i = this.children.length - 1; i >= 0; i--) {
      const c = this.children[i];
      const captured = c.cascadeClick(mouse);
      if (captured) return true;
    }
    return this.click(mouse);
  }

  click(mouse: WidgetMouseEvent): boolean {
    if (this.isDisabled()) return false;
    return this.onClick(mouse);
  }

  /**
   * Will be fired on click() or cascadeClick(). Return 'true' to capture the event, which
   * will make it no longer cascade to other widgets. Return 'false' to pass the event to other widgets.
   * @param absolutePosition Vector2 - The absolute position of the rendering terminal
   * @returns boolean - Capture the event
   */
  onClick(mouse: WidgetMouseEvent): boolean {
    return false;
  }
}
