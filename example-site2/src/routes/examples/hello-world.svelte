<script>
	import { onMount } from "svelte";

	import { Terminal } from "yendor";

	onMount(() => {
		const font = new Terminal.Font("Courier", 24, 15, 24, 1, 24);
		const terminal = Terminal.Canvas.New(10, 10, font);
		terminal.clear();
		terminal.writeAt({
			x: 1,
			y: 1,
			text: "foo",
		});
		terminal.writeAt({
			x: 0,
			y: 0,
			text: "bar",
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
