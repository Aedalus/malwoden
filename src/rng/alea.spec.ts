import { AleaRNG } from "./alea";

describe("AleaRNG", () => {
  it("Can generate numbers", () => {
    const aa = new AleaRNG("hello");
    const bb = new AleaRNG("hello");
    const cc = aa.clone();

    // Run them in sync to compare
    for (let i = 0; i < 100; i++) {
      const a = aa.uint32();
      const b = bb.uint32();
      const c = cc.uint32();

      expect(a).toEqual(b);
      expect(b).toEqual(c);
    }

    for (let i = 0; i < 10; i++) {
      console.log(aa.fract53());
    }
  });
});
