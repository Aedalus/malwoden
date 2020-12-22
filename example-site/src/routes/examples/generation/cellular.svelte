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
		const mount = document.getElementById("example");
		const terminal = Terminal.Retro.fromURL(
			40,
			40,
			"font_16.png",
			16,
			16,
			mount
		);
		const map = new Generation.CellularAutomata(40, 40);
		map.randomize(0.65);
		map.doSimulationStep(3);

		terminal.clear();
		for (let x = 0; x < 80; x++) {
			for (let y = 0; y < 50; y++) {
				const isAlive = map.table.get({ x: x, y: y }) === 1;
				if (isAlive) {
					terminal.drawCharCode({
						x: x,
						y: y,
						charCode: CharCode.blackSpadeSuit,
						fore:
							Math.random() > 0.5 ? Color.green : Color.darkGreen,
					});
				}
			}
		}
		terminal.render();
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

<div id="example" />
