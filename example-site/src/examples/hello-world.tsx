import React from "react"

import { Terminal } from "yendor"

export default class extends React.Component {
  componentDidMount() {
    const mount = document.getElementById("example")
    const font = new Terminal.Font("Courier", 24, 15, 24, 1, 24)
    const terminal = new Terminal.Canvas(20, 10, font, mount)
    terminal.clear()
    terminal.writeAt({
      x: 1,
      y: 1,
      text: "Hello World!",
    })
    terminal.render()
  }

  render() {
    return <div id="example" />
  }
}
