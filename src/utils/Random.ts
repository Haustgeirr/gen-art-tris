// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
export class Alea {
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private c = 1;

  private seeds: string[] = [];

  constructor(seeds: string[]) {
    if (seeds.length === 0) {
      this.seeds = [new Date().toString()];
    }

    this.s0 = this.mash(' ');
    this.s1 = this.mash(' ');
    this.s2 = this.mash(' ');

    for (let i = 0; i < this.seeds.length; i++) {
      this.s0 -= this.mash(this.seeds[i]);
      if (this.s0 < 0) {
        this.s0 += 1;
      }
      this.s1 -= this.mash(this.seeds[i]);
      if (this.s1 < 0) {
        this.s1 += 1;
      }
      this.s2 -= this.mash(this.seeds[i]);
      if (this.s2 < 0) {
        this.s2 += 1;
      }
    }
  }

  public random() {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
    this.s0 = this.s1;
    this.s1 = this.s2;
    return (this.s2 = t - (this.c = t | 0));
  }

  public uint32() {
    return this.random() * 0x100000000; // 2^32
  }

  public fract53() {
    return this.random() + ((this.random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
  }
  private mash(seed: string): number {
    let n = 0xefc8249d;

    for (var i = 0; i < seed.length; i++) {
      n += seed.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  }
}
