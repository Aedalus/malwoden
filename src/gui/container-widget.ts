import { Widget } from "./widget";

export interface ContainerWidgetState {}

export class ContainerWidget<D> extends Widget<ContainerWidgetState, D> {
  render(): void {}
}
