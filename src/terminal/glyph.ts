import { Color } from "./color";

/**
 * Represents a glyph to be drawn to the screen.
 */
export class Glyph {
  readonly char: number;
  readonly fore: Color;
  readonly back: Color;

  /**
   * Creates a glyph from a charCode.
   *
   * @param char - A number representing a charCode.
   * @param fore - A foreground color (default white)
   * @param back - A background color (default black)
   */
  static fromCharCode(
    char: number,
    fore: Color = Color.White,
    back: Color = Color.Black
  ) {
    return new Glyph(String.fromCharCode(char), fore, back);
  }

  /**
   * Creates a Glyph from a single character.
   *
   * @param char - A single character.
   * @param fore - A foreground color (default white)
   * @param back - A background color (default black)
   */
  constructor(
    char: string,
    fore: Color = Color.White,
    back: Color = Color.Black
  ) {
    this.char = char.charCodeAt(0);
    this.fore = fore;
    this.back = back;
  }

  /**
   * Checks to see if two glyphs are equal.
   * @param other Glyph - The other glyph.
   */
  isEqual(other: any) {
    if (other instanceof Glyph === false) return false;
    return (
      this.char === other.char &&
      this.fore.isEqual(other.fore) &&
      this.back.isEqual(other.back)
    );
  }
}
