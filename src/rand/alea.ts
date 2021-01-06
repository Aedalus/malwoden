// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Johannes Baagøe <baagoe@baagoe.com>, 2010

import { IRNG } from "./rng";

function Mash() {
  var n = 0xefc8249d;

  var mash = function (data: string) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}

export class AleaRNG implements IRNG {
  private seed: string;
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private c = 0;

  constructor(seed?: string) {
    // Initialize seed if needed
    this.seed = seed === undefined ? new Date().toString() : seed;
    this.reset();
  }

  reset() {
    let mash = Mash();

    // Initial mashes
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");
    this.c = 1;

    this.s0 -= mash(this.seed);
    this.s1 -= mash(this.seed);
    this.s2 -= mash(this.seed);

    this.sanitize();
  }

  private sanitize() {
    if (this.s0 < 0) this.s0 += 1;
    if (this.s1 < 0) this.s1 += 1;
    if (this.s2 < 0) this.s2 += 1;
  }

  private step(): number {
    // The dark magic that makes the number generator run
    var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
    this.s0 = this.s1;
    this.s1 = this.s2;
    return (this.s2 = t - (this.c = t | 0));
  }

  // Returns between [0,1)
  private nextRand(): number {
    return (
      this.step() + ((this.step() * 0x200000) | 0) * 1.1102230246251565e-16
    ); // 2^-53
  }

  next(min = 0, max = 1): number {
    return this.nextRand() * (max - min) + min;
  }

  nextInt(min = 0, max = 100): number {
    return Math.floor(this.next() * (max - min) + min);
  }

  nextBoolean(): boolean {
    return this.nextRand() > 0.5;
  }

  nextItem<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    const i = this.nextInt(0, array.length);
    return array[i];
  }

  shuffle<T>(array: T[]): T[] {
    const result: T[] = [];
    const clone = array.slice();
    while (clone.length) {
      const index = this.nextInt(0, clone.length);
      result.push(clone.splice(index, 1)[0]);
    }
    return result;
  }

  clone(): AleaRNG {
    const a = new AleaRNG();
    a.s0 = this.s0;
    a.s1 = this.s1;
    a.s2 = this.s2;
    a.c = this.c;
    return a;
  }
}
