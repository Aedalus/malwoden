import { BaseTerminal } from "../terminal";
import { Vector2 } from "../struct";
import * as Calc from "../calc";

export interface WidgetConfig<S> {
  terminal: BaseTerminal;
  initialState: S;
  origin?: Vector2;
}

export interface WidgetUpdateFunc<S, D> {
  (data: D): Partial<S>;
}

export abstract class Widget<S, D> {
  protected absoluteOrigin: Vector2;
  protected origin: Vector2;
  protected terminal: BaseTerminal;
  protected updateFunc?: WidgetUpdateFunc<S, D>;
  protected parent?: Widget<any, D>;
  protected children: Widget<any, D>[] = [];
  protected state: S;

  constructor(config: WidgetConfig<S>) {
    this.terminal = config.terminal;
    this.state = config.initialState;
    this.origin = config.origin ?? { x: 0, y: 0 };
    this.absoluteOrigin = this.origin;
  }

  protected updateAbsoluteOrigin(): void {
    if (this.parent === undefined) {
      this.absoluteOrigin = { ...this.origin };
    } else {
      const parentAbs = this.parent.absoluteOrigin;
      this.absoluteOrigin = Calc.Vector.add(parentAbs, this.origin);
    }
  }

  protected updateOrigin(origin: Vector2) {
    this.origin = origin;
    this.updateAbsoluteOrigin();
    for (const c of this.children) {
      c.updateAbsoluteOrigin();
    }
  }

  getAbsoluteOrigin(): Vector2 {
    return this.absoluteOrigin;
  }

  setUpdateFunc(updateFunc: WidgetUpdateFunc<S, D>) {
    this.updateFunc = updateFunc;
  }

  clearUpdateFunc(): void {
    this.updateFunc = undefined;
  }

  getAbsolutePosition(relativePosition: Vector2): Vector2 {
    return Calc.Vector.add(this.absoluteOrigin, relativePosition);
  }

  getRelativePosition(absolutePosition: Vector2): Vector2 {
    return Calc.Vector.subtract(absolutePosition, this.absoluteOrigin);
  }

  update(data: D): void {
    if (!this.updateFunc) return;
    const s = this.updateFunc(data);
    Object.assign(this.state, s);
  }

  updateCascade(data: D): void {
    if (this.updateFunc) {
      const s = this.updateFunc(data);
      Object.assign(this.state, s);
    }
    for (const c of this.children) {
      c.updateCascade(data);
    }
  }

  addChild<T extends Widget<any, D>>(child: T): T {
    this.children.push(child);
    child.updateAbsoluteOrigin();
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
    return foundChild as T;
  }

  renderCascade(): void {
    this.render();
    for (const c of this.children) {
      c.renderCascade();
    }
  }

  abstract render(): void;
}

// ###########################
// Text - Done
// Panel - Done
// Label - Done
// Bar - Done
// Container - Done
// Button
