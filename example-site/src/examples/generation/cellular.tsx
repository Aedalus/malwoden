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
    const map = new Generation.CellularAutomata(40, 40)
    map.randomize(0.6)
    map.doSimulationStep(3)

    terminal.clear()
    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 50; y++) {
        const isAlive = map.table.get({ x: x, y: y }) === 1
        if (isAlive) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSpadeSuit,
            fore: Math.random() > 0.5 ? Color.Green : Color.DarkGreen,
          })
        }
      }
    }
    terminal.render()
  }
  render() {
    return <div id="example" />
  }
}
