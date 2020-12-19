import * as Yendor from "./yendor";

describe("lib", () => {
  it("has expected modules", () => {
    expect(Yendor.CharCode).toBeTruthy();
    expect(Yendor.Color).toBeTruthy();
    expect(Yendor.FOV).toBeTruthy();
    expect(Yendor.Generation).toBeTruthy();
    expect(Yendor.Glyph).toBeTruthy();
    expect(Yendor.Input).toBeTruthy();
    expect(Yendor.Terminal).toBeTruthy();
    expect(Yendor.Util).toBeTruthy();
  });
});
