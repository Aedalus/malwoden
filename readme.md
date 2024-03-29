# Malwoden

![alt text](./coverage/badge-lines.svg)
![alt text](./coverage/badge-statements.svg)
![alt text](./coverage/badge-functions.svg)
![alt text](./coverage/badge-branches.svg)

[Website](https://malwoden.com) | [Docs](https://docs.malwoden.com)

Malwoden is a roguelike library, meant to perform much of the heavy lifting when creating roguelike games. It takes inspiration from [rot-js](https://ondras.github.io/rot.js/hp), as well as [bracket-lib](https://github.com/thebracket/bracket-lib). ROT still has a number of features we're still building towards, so feel free to take the best parts from each library.

One of the main goals of this library is to provide a simple, minimalistic `Terminal` package with great support for CP437 tilesets.
This is one area I've found lacking, and hope this library can provide a solid framework for roguelikes and text based games.
The core of the terminal package is based heavily on Bob Nystrom's amazing [malison](https://github.com/munificent/malison) Dart library.

If you're looking for graphics outside basic ASCII/CP437, [phaser](https://phaser.io/) and [pixi](https://www.pixijs.com/) are both worth checking out.

---

## Installation

Malwoden can be downloaded via npm:

```sh
# For stable
npm install malwoden

# For dev builds
npm install malwoden@next
```

If developing malwoden locally, you can use `npm link` to easily use it in another project.

```sh
# Inside the malwoden project
npm run start
npm link

# Inside another project
npm link malwoden
```

---

## Modules

- FOV - Field of View Algorithms
- Generation - General Map Creation
- GUI - Useful UI Widgets
- Input - Keyboard + Mouse Abstractions
- Calc - Helpful Math Functions, Like Vector Addition
- Pathfinding - Pathfinding Implementations
- Rand - Seedable RNG
- Terminal - Draw Fonts or Tilesets
- Struct - Common Useful Data Structures

## Showcase

- [Mal](https://aedalus.itch.io/malwoden-7drl) - A short 7drl made by the malwoden team showcasing basic features. Source code available at https://github.com/Aedalus/malwoden-7drl
- [Firefighter RL](http://indspenceable.com/7drl-2021/) - A 7drl with fantastic fire mechanics, made by Indspenceable.

Have a project you'd like added to the list? Feel free to open an issue on the repo with a link!

## Resources

- [Project Setup Tutorial](https://www.youtube.com/watch?v=bN2bI7AlxG0) - A great youtube video made by Rakaneth, showing how to set up a new project from scratch with Malwoden and Webpack. The result can be seen at https://github.com/Rakaneth/malwoden-tut
