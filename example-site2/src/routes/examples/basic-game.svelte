<script lang="ts">
	import { onMount } from "svelte";

	import {
		Glyph,
		Terminal,
		Input,
		Color,
		CharCode,
		Generation,
		GUI,
		Rand,
	} from "yendor";

	onMount(() => {
		// Generate Map
		const map_width = 30;
		const map_height = 20;
		const map = new Generation.CellularAutomata(map_width, map_height);
		map.randomize(0.7);
		map.doSimulationStep();

		const open = [];
		for (let x = 0; x < map.table.width; x++) {
			for (let y = 0; y < map.table.height; y++) {
				if (map.table.get({ x, y }) === 0) open.push({ x, y });
			}
		}
		const rng = new Rand.AleaRNG();
		const start = rng.nextItem(open);
		const coinPos = rng.nextItem(open);

		const logs: string[] = [];
		const addLog = (txt: string) => {
			logs.push(txt);
			while (logs.length > 5) logs.shift();
		};
		addLog("Collect Coins!");

		// Entities
		const player = {
			x: start.x,
			y: start.y,
			hp: 10,
			coins: 0,
		};

		const coin = {
			x: coinPos.x,
			y: coinPos.y,
		};

		function collectCoin() {
			player.coins++;
			const newPos = rng.nextItem(open);
			coin.x = newPos.x;
			coin.y = newPos.y;
			addLog("Coin!");
		}

		function move(dx: number, dy: number) {
			const x = player.x + dx;
			const y = player.y + dy;
			if (
				map.table.isInBounds({ x, y }) &&
				map.table.get({ x, y }) === 0
			) {
				player.x = x;
				player.y = y;
			}
		}

		// Keyboard
		const keyboard = new Input.KeyboardHandler();
		const movement = new Input.KeyboardContext()
			.onDown(Input.KeyCode.DownArrow, () => move(0, 1))
			.onDown(Input.KeyCode.LeftArrow, () => move(-1, 0))
			.onDown(Input.KeyCode.RightArrow, () => move(1, 0))
			.onDown(Input.KeyCode.UpArrow, () => move(0, -1));

		keyboard.setContext(movement);

		const terminal = Terminal.Retro.fromURL(48, 30, "font_16.png", 16, 16);
		// ToDo - Fix this API. 2 Vectors?
		const mapterminal = new Terminal.PortTerminal(
			17,
			1,
			{ x: map_width, y: map_height },
			terminal
		);

		const loop = (delta: number) => {
			// Logic
			if (player.x === coin.x && player.y === coin.y) {
				collectCoin();
			}

			// Rendering
			terminal.clear();

			// Player Box
			GUI.box(terminal, {
				title: "Player",
				x1: 0,
				x2: 15,
				y1: 0,
				y2: 21,
			});

			// HP
			terminal.writeAt({
				x: 2,
				y: 2,
				text: `HP : ${player.hp}/10`,
				fore: Color.red,
			});

			terminal.writeAt({
				x: 2,
				y: 4,
				text: `Gold : ${player.coins}`,
				fore: Color.yellow,
			});

			// World Box
			GUI.box(terminal, {
				x1: 16,
				x2: 16 + 31,
				y1: 0,
				y2: 21,
			});

			// Logs
			GUI.box(terminal, {
				title: "Log",
				x1: 0,
				x2: 16 + 31,
				y1: 22,
				y2: 29,
			});
			for (let i = 0; i < logs.length; i++) {
				terminal.writeAt({
					x: 1,
					y: 23 + i,
					text: logs[i],
				});
			}

			// Draw Map
			for (let x = 0; x < map.table.width; x++) {
				for (let y = 0; y < map.table.height; y++) {
					const isWall = map.table.get({ x, y });
					mapterminal.drawCharCode({
						x,
						y,
						charCode: isWall
							? CharCode.blackSpadeSuit
							: CharCode.space,
						fore: isWall ? Color.green : Color.white,
					});
				}
			}

			// Coin
			mapterminal.drawGlyph(
				coin.x,
				coin.y,
				Glyph.fromCharCode(CharCode.oLower, Color.yellow)
			);
			// Player Entity
			mapterminal.drawGlyph(
				player.x,
				player.y,
				Glyph.fromCharCode(CharCode.at, Color.yellow)
			);

			terminal.render();

			window.requestAnimationFrame(loop);
		};
		window.requestAnimationFrame(loop);
		return () => {
			terminal.delete();
		};
	});
</script>

<svelte:head>
	<title>Basic Game</title>
</svelte:head>

<h1>Basic Game</h1>

<p>This is a very basic game using Yendor.</p>
