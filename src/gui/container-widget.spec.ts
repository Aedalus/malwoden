import { MemoryTerminal } from "../terminal/memory-terminal";
import { ContainerWidget } from "./container-widget";

describe("ContainerWidget", () => {
  it("Can create a new container", () => {
    const w = new ContainerWidget();
  });

  it("will render nothing", () => {
    const terminal = new MemoryTerminal({ width: 10, height: 10 });
    const w = new ContainerWidget();
    w.onDraw({ terminal });
  });
});
