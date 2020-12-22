<script>
	import { onMount } from "svelte";

	import { Terminal } from "yendor";

	onMount(() => {
		const mount = document.getElementById("example");
		const font = new Terminal.Font("Courier", 24, 15, 24, 1, 24);
		const terminal = new Terminal.Canvas(20, 10, font, mount);
		terminal.clear();
		terminal.writeAt({
			x: 1,
			y: 1,
			text: "Hello World!",
		});
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
