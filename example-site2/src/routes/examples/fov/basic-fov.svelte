<script lang="ts">
	import { onMount } from "svelte";

	import {
		Terminal,
		Util,
		Generation,
		FOV,
		Input,
		CharCode,
		Color,
	} from "yendor";

	onMount(() => {
		const terminal = Terminal.Retro.fromURL(40, 40, "font_16.png", 16, 16);
		const explored = new Util.Table<boolean>(80, 50);
		const map = new Generation.CellularAutomata(80, 50);
		map.randomize(0.6);
		map.doSimulationStep(3);

		const player = {
			x: 10,
			y: 10,
		};

		const fov = new FOV.PreciseShadowcasting(
			(x, y) => map.table.get({ x, y }) !== 1
		);

		// Keyboard
		const keyboard = new Input.KeyboardHandler();
		const movement = new Input.KeyboardContext()
			.onDown(Input.KeyCode.DownArrow, () => {
				attemptMove(0, 1);
				calcFOV();
			})
			.onDown(Input.KeyCode.LeftArrow, () => {
				attemptMove(-1, 0);
				calcFOV();
			})
			.onDown(Input.KeyCode.RightArrow, () => {
				attemptMove(1, 0);
				calcFOV();
			})
			.onDown(Input.KeyCode.UpArrow, () => {
				attemptMove(0, -1);
				calcFOV();
			});

		keyboard.setContext(movement);

		let fov_spaces: { x: number; y: number; r: number; v: number }[] = [];
		calcFOV();

		function attemptMove(dx: number, dy: number) {
			const x = player.x + dx;
			const y = player.y + dy;
			if (map.table.get({ x, y }) !== 1) {
				player.x = x;
				player.y = y;
			}
		}
		function calcFOV() {
			fov_spaces = [];
			// fov.compute(player.x, player.y, 7, (x, y, r, v) => {
			fov.calculateCallback(player.x, player.y, 10, (x, y, r, v) => {
				if (v) {
					explored.set({ x, y }, true);
					fov_spaces.push({ x, y, r, v });
				}
			});
		}

		const loop = () => {
			terminal.clear();

			// Draw all tiles
			for (let x = 0; x < 80; x++) {
				for (let y = 0; y < 50; y++) {
					if (explored.get({ x, y })) {
						const isAlive = map.table.get({ x, y }) === 1;
						if (isAlive) {
							terminal.drawCharCode({
								x: x,
								y: y,
								charCode: CharCode.blackSpadeSuit,
								fore: Color.darkGreen.blend(Color.black, 0.7),
								back: Color.green.blend(Color.black, 0.7),
							});
						} else {
							terminal.drawCharCode({
								x: x,
								y: y,
								charCode: CharCode.fullBlock,
								fore: Color.green.blend(Color.black, 0.7),
							});
						}
					}
				}
			}

			// Draw tiles in fov
			for (let { x, y, v } of fov_spaces) {
				const isAlive = map.table.get({ x, y }) === 1;
				if (isAlive) {
					terminal.drawCharCode({
						x: x,
						y: y,
						charCode: CharCode.blackSpadeSuit,
						fore: Color.darkGreen.blend(Color.black, (1 - v) / 2),
						back: Color.green.blend(Color.black, (1 - v) / 2),
					});
				} else {
					terminal.drawCharCode({
						x: x,
						y: y,
						charCode: CharCode.fullBlock,
						fore: Color.green.blend(Color.black, (1 - v) / 2),
					});
				}
			}

			// Draw player
			terminal.drawCharCode({
				x: player.x,
				y: player.y,
				charCode: CharCode.at,
				fore: Color.yellow,
			});
			// Generate Trees
			// for (let x = 0; x < 80; x++) {
			// for (let y = 0; y < 50; y++) {}
			// }
			terminal.render();
			requestAnimationFrame(loop);
		};
		requestAnimationFrame(loop);

		return () => {
			terminal.delete();
		};
	});
</script>

<svelte:head>
	<title>Hello World</title>
</svelte:head>

<h1>Hello World Example</h1>

<p>This is a basic example showing how to create a new terminal.</p>
