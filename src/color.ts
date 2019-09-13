export class Color {
  static black = new Color(0, 0, 0);
  static white = new Color(255, 255, 255);

  static lightGray = new Color(192, 192, 192);
  static gray = new Color(128, 128, 128);
  static darkGray = new Color(64, 64, 64);

  static lightRed = new Color(255, 160, 160);
  static red = new Color(220, 0, 0);
  static darkRed = new Color(100, 0, 0);

  static lightOrange = new Color(255, 200, 170);
  static orange = new Color(255, 128, 0);
  static darkOrange = new Color(128, 64, 0);

  static lightGold = new Color(255, 230, 150);
  static gold = new Color(255, 192, 0);
  static darkGold = new Color(128, 96, 0);

  static lightYellow = new Color(255, 255, 150);
  static yellow = new Color(255, 255, 0);
  static darkYellow = new Color(128, 128, 0);

  static lightGreen = new Color(130, 255, 90);
  static green = new Color(0, 128, 0);
  static darkGreen = new Color(0, 64, 0);

  static lightAqua = new Color(128, 255, 255);
  static aqua = new Color(0, 255, 255);
  static darkAqua = new Color(0, 128, 128);

  static lightBlue = new Color(128, 160, 255);
  static blue = new Color(0, 64, 255);
  static darkBlue = new Color(0, 37, 168);

  static lightPurple = new Color(200, 140, 255);
  static purple = new Color(128, 0, 255);
  static darkPurple = new Color(64, 0, 128);

  static lightBrown = new Color(190, 150, 100);
  static brown = new Color(160, 110, 60);
  static darkBrown = new Color(100, 64, 32);

  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  isEqual(color: Color) {
    return this.r === color.r && this.g === color.g && this.b === color.b;
  }

  cssColor() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  private sanitizeElement(rgb: number): number {
    return Math.round(Math.min(Math.max(rgb, 0), 255));
  }

  add(other: Color, fractionOther: number = 1): Color {
    return new Color(
      this.sanitizeElement(this.r + other.r * fractionOther),
      this.sanitizeElement(this.g + other.g * fractionOther),
      this.sanitizeElement(this.b + other.b * fractionOther)
    );
  }

  blend(other: Color, fractionOther: number = 0) {
    const fractionThis = 1.0 - fractionOther;
    return new Color(
      this.sanitizeElement(this.r * fractionThis + other.r * fractionOther),
      this.sanitizeElement(this.g * fractionThis + other.g * fractionOther),
      this.sanitizeElement(this.b * fractionThis + other.b * fractionOther)
    );
  }

  blendPercent(other: Color, percentOther: number) {
    return this.blend(other, percentOther / 100);
  }
}
