import { Color } from "./color";

export class Glyph {
  readonly char: number;
  readonly fore: Color;
  readonly back: Color;

  static fromCharCode(
    char: number,
    fore: Color = Color.White,
    back: Color = Color.Black
  ) {
    return new Glyph(String.fromCharCode(char), fore, back);
  }

  constructor(
    char: string,
    fore: Color = Color.White,
    back: Color = Color.Black
  ) {
    this.char = char.charCodeAt(0);
    this.fore = fore;
    this.back = back;
  }

  isEqual(other: any) {
    if (other instanceof Glyph === false) return false;
    return (
      this.char === other.char &&
      this.fore.isEqual(other.fore) &&
      this.back.isEqual(other.back)
    );
  }
}
