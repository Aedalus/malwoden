import { WidgetConfig } from ".";
import { Widget } from "./widget";

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

  onDraw(): void {
    return;
  }
}
