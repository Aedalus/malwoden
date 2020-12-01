// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Johannes Baagøe <baagoe@baagoe.com>, 2010

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

export class AleaRNG {
  private seed: string;
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private c = 0;

  constructor(seed?: string) {
    // Initialize seed if needed
    this.seed = seed === undefined ? new Date().toString() : seed;
    this.init();
  }

  private init() {
    let mash = Mash();

    // Initial mashes
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");
    this.c = 1;

    this.s0 -= mash(this.seed);
    if (this.s0 < 0) this.s0 += 1;

    this.s1 -= mash(this.seed);
    if (this.s1 < 0) this.s1 += 1;

    this.s2 -= mash(this.seed);
    if (this.s2 < 0) this.s2 += 1;
  }

  private next(): number {
    // The dark magic that makes the number generator run
    var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
    this.s0 = this.s1;
    this.s1 = this.s2;
    return (this.s2 = t - (this.c = t | 0));
  }

  uint32(): number {
    return this.next() * 0x100000000; // 2^32
  }

  fract53(): number {
    return this.next() + ((this.next() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
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
