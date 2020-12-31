import React from "react"
import { Terminal, Generation, CharCode, Color } from "yendor"

export default class extends React.Component {
  componentDidMount() {
    const mount = document.getElementById("example")
    const terminal = Terminal.Retro.fromURL(
      40,
      40,
      "/font_16.png",
      16,
      16,
      mount
    )
    const map = new Generation.DrunkardsWalk(40, 40)

    map.walkSteps({
      initialCords: { x: 20, y: 20 },
      stepsToTake: Infinity,
      toCoverTileCount: 400,
    })

    terminal.clear()
    for (let x = 0; x < map.table.width; x++) {
      for (let y = 0; y < map.table.height; y++) {
        if (map.table.get({ x: x, y: y }) === 1) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSquare,
            back: Color.RosyBrown,
          })
        } else {
          terminal.drawCharCode({
            x,
            y,
            charCode: CharCode.blackUpPointingTriangle,
            fore: Color.SaddleBrown,
            back: Color.RosyBrown,
          })
        }
      }
    }
  }
  render() {
    return <div id="example" />
  }
}
