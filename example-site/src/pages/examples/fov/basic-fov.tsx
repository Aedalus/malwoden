import React from "react"

import { Terminal, Util, Generation, FOV, Input, CharCode, Color } from "yendor"

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
    const explored = new Util.Table<boolean>(40, 40)
    const map = new Generation.CellularAutomata(40, 40)
    map.randomize(0.6)
    map.doSimulationStep(3)

    const free = []
    for (let x = 0; x < map.table.width; x++) {
      for (let y = 0; y < map.table.height; y++) {
        if (map.table.get({ x, y }) !== map.aliveValue) {
          free.push({ x, y })
        }
      }
    }
    const player = {
      x: free[0].x,
      y: free[0].y,
    }

    const fov = new FOV.PreciseShadowcasting(
      (x, y) => map.table.get({ x, y }) !== 1
    )

    // Keyboard
    const keyboard = new Input.KeyboardHandler()
    const movement = new Input.KeyboardContext()
      .onDown(Input.KeyCode.DownArrow, () => {
        attemptMove(0, 1)
        calcFOV()
      })
      .onDown(Input.KeyCode.LeftArrow, () => {
        attemptMove(-1, 0)
        calcFOV()
      })
      .onDown(Input.KeyCode.RightArrow, () => {
        attemptMove(1, 0)
        calcFOV()
      })
      .onDown(Input.KeyCode.UpArrow, () => {
        attemptMove(0, -1)
        calcFOV()
      })

    keyboard.setContext(movement)

    let fov_spaces: { x: number; y: number; r: number; v: number }[] = []
    calcFOV()

    function attemptMove(dx: number, dy: number) {
      const x = player.x + dx
      const y = player.y + dy
      if (map.table.get({ x, y }) !== 1) {
        player.x = x
        player.y = y
      }
    }
    function calcFOV() {
      fov_spaces = []
      // fov.compute(player.x, player.y, 7, (x, y, r, v) => {
      fov.calculateCallback(player.x, player.y, 10, (x, y, r, v) => {
        if (v) {
          if (explored.isInBounds({ x, y })) {
            explored.set({ x, y }, true)
          }
          fov_spaces.push({ x, y, r, v })
        }
      })
    }

    const loop = () => {
      terminal.clear()

      // Draw all tiles
      for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 50; y++) {
          if (explored.get({ x, y })) {
            const isAlive = map.table.get({ x, y }) === 1
            if (isAlive) {
              terminal.drawCharCode({
                x: x,
                y: y,
                charCode: CharCode.blackSpadeSuit,
                fore: Color.DarkGreen.toAvgGrayscale(),
                back: Color.Green.toAvgGrayscale(),
              })
            } else {
              terminal.drawCharCode({
                x: x,
                y: y,
                charCode: CharCode.fullBlock,
                fore: Color.Green.toAvgGrayscale(),
              })
            }
          }
        }
      }

      // Draw tiles in fov
      for (let { x, y, v } of fov_spaces) {
        const isAlive = map.table.get({ x, y }) === 1
        if (isAlive) {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.blackSpadeSuit,
            fore: Color.DarkGreen.blend(Color.Black, (1 - v) / 2),
            back: Color.Green.blend(Color.Black, (1 - v) / 2),
          })
        } else {
          terminal.drawCharCode({
            x: x,
            y: y,
            charCode: CharCode.fullBlock,
            fore: Color.Green.blend(Color.Black, (1 - v) / 2),
          })
        }
      }

      // Draw player
      terminal.drawCharCode({
        x: player.x,
        y: player.y,
        charCode: CharCode.at,
        fore: Color.Yellow,
      })

      terminal.render()
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  render() {
    return <div id="example" />
  }
}
