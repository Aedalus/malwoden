import { CharCode } from './char-code'
import { Color } from './color'

export class Glyph {
  readonly char: number
  readonly fore: Color
  readonly back: Color

  static fromCharCode(char: number, fore: Color = Color.white, back: Color = Color.black) {
    return new Glyph(String.fromCharCode(char), fore, back)
  }

  constructor(char: string, fore: Color = Color.white, back: Color = Color.black) {
    this.char = char.charCodeAt(0)
    this.fore = fore
    this.back = back
  }

  isEqual(other: Glyph) {
    return (
      this.char === other.char && this.fore.isEqual(other.fore) && this.back.isEqual(other.back)
    )
  }
}
