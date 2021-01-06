# (!Alpha) Yendor

![alt text](./coverage/badge-lines.svg)
![alt text](./coverage/badge-statements.svg)
![alt text](./coverage/badge-functions.svg)
![alt text](./coverage/badge-branches.svg)

Yendor is a roguelike library, meant to perform much of the heavy lifting when creating roguelike games. It takes inspiration from [rot-js](https://ondras.github.io/rot.js/hp), as well as [bracket-lib](https://github.com/thebracket/bracket-lib). ROT still has a number of features we're still building towards, so feel free to take the best parts from each library.

One of the main goals of this library is to provide a simple, minimalistic `Terminal` package with great support for CP437 tilesets.
This is one area I've found lacking, and hope this library can provide a solid framework for roguelikes and text based games.
The core of the terminal package is based heavily on Bob Nystrom's amazing [malison](https://github.com/munificent/malison) Dart library,
which can be seen in action in his roguelike, [Hauberk.](http://munificent.github.io/hauberk/)

If you're looking for graphics outside basic ASCII/CP437, [phaser](https://phaser.io/) and [pixi](https://www.pixijs.com/) are both worth checking out.

## Alpha

This library is still in alpha. While many of the features are working well, the api is not fully finalized yet. We welcome any feedback on the design and implementation so far, and hope to launch a public beta early 2021.

## Installation

This package is not yet hosted, but will be available on npm once in beta.

If you want to try it out now, consider building it locally and linking it via `npm link`

```
# Inside the yendor project
npm run start
npm link

# Inside another project
npm link yendor
```

## Modules

- FOV (30%)

  - [ ] docs
  - [ ] examples

  - [x] Precise Shadowcasting
    - [x] Topology - 4
    - [x] Topology - 8
    - [ ] Topology - Circle

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

  - [x] A\*

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
