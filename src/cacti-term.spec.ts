import * as Cacti from "./cacti-term";

describe("lib", () => {
  it("has expected modules", () => {
    expect(Cacti.CharCode).toBeTruthy();
    expect(Cacti.Color).toBeTruthy();
    expect(Cacti.FOV).toBeTruthy();
    expect(Cacti.Generation).toBeTruthy();
    expect(Cacti.Glyph).toBeTruthy();
    expect(Cacti.Input).toBeTruthy();
    expect(Cacti.Terminal).toBeTruthy();
    expect(Cacti.Util).toBeTruthy();
  });
});
