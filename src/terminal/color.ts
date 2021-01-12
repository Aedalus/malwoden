export class Color {
  // CSS Extended Color Palette
  // https://en.wikipedia.org/wiki/Web_colors

  // Pink Colors
  static readonly MediumVioletRed = new Color(199, 21, 133);
  static readonly DeepPink = new Color(255, 20, 147);
  static readonly PaleVioletRed = new Color(219, 112, 147);
  static readonly HotPink = new Color(255, 105, 180);
  static readonly LightPink = new Color(255, 182, 193);
  static readonly Pink = new Color(255, 192, 203);

  // Red Colors
  static readonly DarkRed = new Color(139, 0, 0);
  static readonly Red = new Color(255, 0, 0);
  static readonly Firebrick = new Color(178, 34, 34);
  static readonly Crimson = new Color(220, 20, 60);
  static readonly IndianRed = new Color(205, 92, 92);
  static readonly LightCoral = new Color(240, 128, 128);
  static readonly Salmon = new Color(250, 128, 114);
  static readonly DarkSalmon = new Color(233, 150, 122);
  static readonly LightSalmon = new Color(255, 160, 122);

  // Orange Colors
  static readonly OrangeRed = new Color(255, 69, 0);
  static readonly Tomato = new Color(255, 99, 71);
  static readonly DarkOrange = new Color(255, 140, 0);
  static readonly Coral = new Color(255, 127, 80);
  static readonly Orange = new Color(255, 165, 0);

  // Yellow Colors
  static readonly DarkKhaki = new Color(189, 183, 107);
  static readonly Gold = new Color(255, 215, 0);
  static readonly Khaki = new Color(240, 230, 140);
  static readonly PeachPuff = new Color(255, 218, 185);
  static readonly Yellow = new Color(255, 255, 0);
  static readonly PaleGoldenrod = new Color(238, 232, 170);
  static readonly Moccasin = new Color(255, 228, 181);
  static readonly PapayaWhip = new Color(255, 239, 213);
  static readonly LightGoldenrodYellow = new Color(250, 250, 210);
  static readonly LemonChiffon = new Color(255, 250, 205);
  static readonly LightYellow = new Color(255, 255, 224);

  // Brown Colors
  static readonly Maroon = new Color(128, 0, 0);
  static readonly Brown = new Color(165, 42, 42);
  static readonly SaddleBrown = new Color(139, 69, 19);
  static readonly Sienna = new Color(160, 82, 45);
  static readonly Chocolate = new Color(210, 105, 30);
  static readonly DarkGoldenrod = new Color(184, 134, 11);
  static readonly Peru = new Color(205, 133, 63);
  static readonly RosyBrown = new Color(188, 143, 143);
  static readonly Goldenrod = new Color(218, 165, 32);
  static readonly SandyBrown = new Color(244, 164, 96);
  static readonly Tan = new Color(210, 180, 140);
  static readonly Burlywood = new Color(222, 184, 135);
  static readonly Wheat = new Color(245, 222, 179);
  static readonly NavajoWhite = new Color(255, 222, 173);
  static readonly Bisque = new Color(255, 228, 196);
  static readonly BlanchedAlmond = new Color(255, 235, 205);
  static readonly Cornsilk = new Color(255, 248, 220);

  // Purple/Violet/Magenta Colors
  static readonly Indigo = new Color(75, 0, 130);
  static readonly Purple = new Color(128, 0, 128);
  static readonly DarkMagenta = new Color(139, 9, 139);
  static readonly DarkViolet = new Color(148, 0, 211);
  static readonly DarkSlateBlue = new Color(72, 61, 129);
  static readonly BlueViolet = new Color(138, 43, 226);
  static readonly DarkOrchid = new Color(153, 50, 204);
  static readonly Fuchsia = new Color(255, 0, 255);
  static readonly Magenta = new Color(255, 0, 255); // Alias Fuchsia
  static readonly SlateBlue = new Color(106, 90, 205);
  static readonly MediumSlateBlue = new Color(123, 104, 238);
  static readonly MediumOrchid = new Color(186, 85, 211);
  static readonly MediumPurple = new Color(147, 112, 219);
  static readonly Orchid = new Color(218, 11, 214);
  static readonly Violet = new Color(238, 130, 238);
  static readonly Plum = new Color(221, 160, 221);
  static readonly Thistle = new Color(216, 191, 216);
  static readonly Lavender = new Color(230, 230, 250);

  // White Colors
  static readonly MistyRose = new Color(255, 228, 225);
  static readonly AntiqueWhite = new Color(250, 235, 215);
  static readonly Linen = new Color(250, 240, 230);
  static readonly Beige = new Color(245, 245, 220);
  static readonly WhiteSmoke = new Color(245, 245, 245);
  static readonly LavenderBlush = new Color(255, 240, 245);
  static readonly OldLace = new Color(253, 245, 230);
  static readonly AliceBlue = new Color(240, 248, 255);
  static readonly Seashell = new Color(255, 245, 238);
  static readonly GhostWhite = new Color(248, 248, 255);
  static readonly Honeydew = new Color(240, 255, 240);
  static readonly FloralWhite = new Color(255, 250, 240);
  static readonly Azure = new Color(240, 255, 255);
  static readonly MintCream = new Color(245, 255, 250);
  static readonly Snow = new Color(255, 250, 250);
  static readonly Ivory = new Color(255, 255, 240);
  static readonly White = new Color(255, 255, 255);

  // Grey + Black Colors
  static readonly Black = new Color(0, 0, 0);
  static readonly DarkSlateGray = new Color(47, 79, 79);
  static readonly DimGray = new Color(105, 105, 105);
  static readonly SlateGray = new Color(112, 128, 144);
  static readonly Gray = new Color(128, 128, 128);
  static readonly LightSlateGray = new Color(119, 136, 153);
  static readonly DarkGray = new Color(169, 169, 169);
  static readonly Silver = new Color(192, 192, 192);
  static readonly LightGray = new Color(211, 211, 211);
  static readonly Gainsboro = new Color(220, 220, 220);

  // Green Colors
  static readonly DarkGreen = new Color(0, 100, 0);
  static readonly Green = new Color(0, 128, 0);
  static readonly DarkOliveGreen = new Color(85, 107, 47);
  static readonly ForestGreen = new Color(34, 139, 34);
  static readonly SeaGreen = new Color(46, 139, 87);
  static readonly Olive = new Color(128, 128, 0);
  static readonly OliveDrab = new Color(107, 142, 35);
  static readonly MediumSeaGreen = new Color(60, 179, 113);
  static readonly LimeGreen = new Color(50, 205, 50);
  static readonly Lime = new Color(0, 255, 0);
  static readonly SpringGreen = new Color(0, 255, 127);
  static readonly MediumSpringGreen = new Color(0, 250, 154);
  static readonly DarkSeaGreen = new Color(143, 188, 143);
  static readonly MediumAquamarine = new Color(102, 205, 170);
  static readonly YellowGreen = new Color(154, 205, 50);
  static readonly LawnGreen = new Color(124, 252, 0);
  static readonly Chartreuse = new Color(127, 255, 0);
  static readonly LightGreen = new Color(133, 238, 144);
  static readonly GreenYellow = new Color(173, 255, 47);
  static readonly PaleGreen = new Color(152, 251, 152);

  // Cyan Colors
  static readonly Teal = new Color(0, 128, 128);
  static readonly DarkCyan = new Color(0, 139, 139);
  static readonly LightSeaGreen = new Color(32, 178, 170);
  static readonly CadetBlue = new Color(95, 158, 160);
  static readonly DarkTurquoise = new Color(0, 206, 209);
  static readonly MediumTurquoise = new Color(72, 209, 204);
  static readonly Turquoise = new Color(64, 224, 208);
  static readonly Aqua = new Color(0, 255, 255);
  static readonly Cyan = new Color(0, 255, 255);
  static readonly Aquamarine = new Color(127, 255, 212);
  static readonly PaleTurquoise = new Color(175, 238, 238);
  static readonly LightCyan = new Color(244, 255, 255);

  // Blue Colors
  static readonly Navy = new Color(0, 0, 128);
  static readonly DarkBlue = new Color(0, 0, 139);
  static readonly MediumBlue = new Color(0, 0, 205);
  static readonly Blue = new Color(0, 0, 225);
  static readonly MidnightBlue = new Color(25, 25, 112);
  static readonly RoyalBlue = new Color(65, 105, 225);
  static readonly SteelBlue = new Color(70, 130, 180);
  static readonly DodgerBlue = new Color(30, 144, 255);
  static readonly DeepSkyBlue = new Color(0, 191, 255);
  static readonly CornflowerBlue = new Color(100, 149, 237);
  static readonly SkyBlue = new Color(135, 206, 235);
  static readonly LightSkyBlue = new Color(135, 206, 250);
  static readonly LightSteelBlue = new Color(176, 196, 222);
  static readonly LightBlue = new Color(173, 216, 230);
  static readonly PowderBlue = new Color(176, 224, 230);

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

  blend(other: Color, fractionOther: number = 0.5) {
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

  toGrayscale(): Color {
    const total = this.r + this.g + this.b;
    return new Color(
      this.sanitizeElement(total / 3),
      this.sanitizeElement(total / 3),
      this.sanitizeElement(total / 3)
    );
  }
}
