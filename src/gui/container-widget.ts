import { WidgetConfig } from ".";
import { Widget } from "./widget";

export interface ContainerWidgetState {}

export class ContainerWidget<D> extends Widget<ContainerWidgetState, D> {
  constructor(config?: Partial<WidgetConfig<ContainerWidgetState>>) {
    super({
      initialState: {},
      ...config,
    });
  }
  onDraw(): void {}
}
