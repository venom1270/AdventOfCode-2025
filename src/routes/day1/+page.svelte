<script lang="ts">
	let data: string = $state('');
	let part1 = $state(0);
	let part2 = $state(0);

	let part1Time = $state(0);
	let part2Time = $state(0);

	function processFile(e: Event) {
		const target = event?.target as HTMLInputElement;
		const file: File | undefined = target?.files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (readerEvent) => {
			data = (readerEvent.target?.result as string) || '';
		};

		reader.readAsText(file);
	}

	let solving = $state(false);

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const moves = data.split('\n').map((d) => d.replace('\r', ''));
		let position = 50;

		const start = performance.now();

		for (const move of moves) {
			const direction = move[0];
			let rotation = parseInt(move.slice(1));

			if (direction == 'L') {
				if (rotation > position) {
					if (rotation % 100 > position && position != 0) part2 += 1;
					part2 += Math.floor(rotation / 100);
					rotation = 100 - (rotation % 100);
				} else {
					rotation *= -1;
				}
			} else {
				if (rotation + position > 100) {
					part2 += Math.floor((rotation + position) / 100);
					part2 += Math.floor((rotation + position) % 100) != 0 ? 0 : -1;
				}
			}

			rotation %= 100;

			position += rotation;
			position %= 100;

			if (position == 0) {
				part1++;
				part2++;
			}
		}

		const end = performance.now();
		part1Time = part2Time = (end - start).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 1</h1>

<input type="file" onchange={processFile} />
<br />
<button onclick={solve} disabled={data == ''}>Solve</button>

{#if solving}
	Solving...
{:else if part1 != 0}
	<p>
		Part 1: {part1} <span class="italic">({part1Time}ms)</span>
	</p>

	<p>
		Part 2: {part2} <span class="italic">({part2Time}ms)</span>
	</p>
{/if}

<style>
	.italic {
		font-style: italic;
	}
</style>
