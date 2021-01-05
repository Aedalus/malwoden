import { AleaRNG } from "./alea";

describe("AleaRNG", () => {
  it("Can generate numbers", () => {
    const aa = new AleaRNG("hello");
    const bb = new AleaRNG("hello");
    const cc = aa.clone();

    // Run them in sync to compare
    for (let i = 0; i < 100; i++) {
      const a = aa.next();
      const b = bb.next();
      const c = cc.next();

      expect(a).toEqual(b);
      expect(b).toEqual(c);
    }

    // Ints
    for (let i = 0; i < 100; i++) {
      const a = aa.nextInt();
      const b = bb.nextInt();
      const c = cc.nextInt();

      expect(a).toEqual(b);
      expect(b).toEqual(c);
    }
  });

  it("Will generate different numbers with different seeds", () => {
    const aa = new AleaRNG(Math.random().toString());
    const bb = new AleaRNG(Math.random().toString());

    const a = [];
    const b = [];

    for (let i = 0; i < 100; i++) {
      a.push(aa.next());
      b.push(bb.next());
    }

    expect(a).not.toEqual(b);
  });

  it("will generate numbers in the correct ranges", () => {
    const aa = new AleaRNG();

    // ints
    const min = 50;
    const max = 55;
    for (let i = 0; i < 1000; i++) {
      const v = aa.nextInt(min, max);
      const v2 = aa.next(min, max);

      // Test int
      expect(v).toBeGreaterThanOrEqual(min);
      expect(v).toBeLessThan(max);

      // Test float
      expect(v2).toBeGreaterThanOrEqual(min);
      expect(v2).toBeLessThan(max);
    }
  });

  it("Can reset itself", () => {
    const aa = new AleaRNG("hello");
    const bb = new AleaRNG("hello");

    for (let i = 0; i < 10; i++) {
      aa.next();
    }

    aa.reset();

    for (let i = 0; i < 100; i++) {
      expect(aa.next()).toEqual(bb.next());
    }
  });

  it("Can get booleans", () => {
    const aa = new AleaRNG();
    const bools = [];

    for (let i = 0; i < 100; i++) {
      bools.push(aa.nextBoolean());
    }

    expect(bools.some((x) => x)).toBeTruthy();
    expect(bools.some((x) => !x)).toBeTruthy();
  });

  it("Can get a random item from an array", () => {
    const aa = new AleaRNG();
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < 100; i++) {
      let e = aa.nextItem(nums);
      expect(e).not.toBeUndefined();
      expect(nums.includes(e!)).toBeTruthy();
    }

    expect(nums).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("Can shuffle an array", () => {
    const aa = new AleaRNG();
    const alph = "abcdefghijklmnopqrstuvwxyz".split("");

    const alph2 = aa.shuffle(alph);

    expect(alph).toEqual("abcdefghijklmnopqrstuvwxyz".split(""));
    expect(alph).not.toEqual(alph2);
    expect(alph).toHaveLength(alph2.length);

    for (let c of alph) {
      expect(alph2.indexOf(c)).toBeGreaterThanOrEqual(0);
    }
  });
});
