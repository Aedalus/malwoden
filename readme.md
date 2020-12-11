# Delve

Delve is a roguelike library, meant to perform much of the heavy lifting when creating roguelike games. It takes inspiration from [rot-js](https://ondras.github.io/rot.js/hp), as well as [bracket-lib](https://github.com/thebracket/bracket-lib). ROT still has a number of features we're still building towards, so feel free to take the best parts from each library.

One of the main goals of this library is to provide a simple, minimalistic `Terminal` package with great support for CP437 tilesets, along with a collection of UI "widgets." This is one area I've found lacking, and hope this library can provide a solid framework for roguelikes and text based games. The core of the terminal package is based heavily on Bob Nystrom's amazing [malison](https://github.com/munificent/malison) Dart library, which can be seen in action in his roguelike, [Hauberk.](http://munificent.github.io/hauberk/)

If you're looking for graphics outside basic ASCII/CP437, [phaser](https://phaser.io/) and [pixi](https://www.pixijs.com/) are both worth checking out.

## Installation

This package can be installed from NPM:

```
npm install @aedalus/delve
```

## Modules

- FOV (30%)

  - [ ] docs
  - [ ] examples

  - [x] Precise Shadowcasting
    - [x] Topology - 4
    - [x] Topology - 8

- Generation (10%)

  - [ ] docs
  - [ ] examples

  - [x] Cellular Automata
  - [ ] BSP

- Input (30%)

  - [ ] docs
  - [ ] examples

- Pathfinding (0%)

  - [ ] docs
  - [ ] examples

- Rand (80%)

  - [ ] docs
  - [ ] examples

  - [x] AleaRNG

- Terminal (80%)

  - [ ] docs
  - [ ] examples

- Util
  - [ ] docs
  - [ ] examples
