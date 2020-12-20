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
		const map = new Generation.DrunkardsWalk(40, 40);

		map.walkSteps({
			initialCords: { x: 20, y: 20 },
			stepsToTake: Infinity,
			toCoverTileCount: 200,
		});

		terminal.clear();
		for (let x = 0; x < map.table.width; x++) {
			for (let y = 0; y < map.table.height; y++) {
				if (map.table.get({ x: x, y: y }) === 1) {
					terminal.drawCharCode({
						x: x,
						y: y,
						charCode: CharCode.blackSpadeSuit,
						fore: Color.green,
					});
				}
			}
		}
		return () => {
			terminal.delete();
		};
	});
</script>

<svelte:head>
	<title>Drunkards Walk</title>
</svelte:head>

<h1>Drunkards Walk</h1>

<p>
	The drunkards walk can walk until a set number of tiles have been visited.
	For example, in the following map, we walk until 200 tiles are visited.
</p>
