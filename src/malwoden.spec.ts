import * as Malwoden from "./malwoden";

describe("lib", () => {
  it("has expected modules", () => {
    expect(Malwoden.CharCode).toBeTruthy();
    expect(Malwoden.Color).toBeTruthy();
    expect(Malwoden.FOV).toBeTruthy();
    expect(Malwoden.Generation).toBeTruthy();
    expect(Malwoden.Glyph).toBeTruthy();
    expect(Malwoden.GUI).toBeTruthy();
    expect(Malwoden.Rand).toBeTruthy();
    expect(Malwoden.Input).toBeTruthy();
    expect(Malwoden.Terminal).toBeTruthy();
    expect(Malwoden.Util).toBeTruthy();
  });
});
