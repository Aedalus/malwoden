import { WidgetConfig } from ".";
import { Widget, WidgetDrawCtx } from "./widget";

export interface ContainerWidgetState {}

/**
 * An empty widget, used to hold other widgets.
 */
export class ContainerWidget extends Widget<ContainerWidgetState> {
  constructor(config?: Partial<WidgetConfig<ContainerWidgetState>>) {
    super({
      initialState: {},
      ...config,
    });
  }

  onDraw(ctx: WidgetDrawCtx): void {
    return;
  }
}
