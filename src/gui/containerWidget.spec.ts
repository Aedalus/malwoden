import { ContainerWidget } from "./container-widget";

describe("ContainerWidget", () => {
  it("Can create a new container", () => {
    const w = new ContainerWidget();
  });

  it("will render nothing", () => {
    const w = new ContainerWidget();
    w.onDraw();
  });
});
