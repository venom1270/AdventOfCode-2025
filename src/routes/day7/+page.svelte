<script lang="ts">
	let data: string = $state('');
	let part1 = $state(0);
	let part2 = $state(0);

	let part1Time = $state('');
	let part2Time = $state('');

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

	function parse() {
		return data.split('\n').map((b) => b.replace('\r', ''));
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const grid = parse();

		const start1 = performance.now();

		let beamLocations: { [key: number]: number | undefined } = {};

		for (let i = 0; i < grid[0].length; i++) {
			if (grid[0][i] == 'S') {
				beamLocations[i] = true;
			}
		}

		for (let i = 1; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] == '^') {
					if (beamLocations[j] != undefined) {
						if (j - 1 >= 0) beamLocations[j - 1] = 1;
						if (j + 1 < grid[i].length) beamLocations[j + 1] = 1;
						beamLocations[j] = undefined;
						part1++;
					}
				}
			}
		}

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		beamLocations = {};

		for (let i = 0; i < grid[0].length; i++) {
			if (grid[0][i] == 'S') {
				beamLocations[i] = 1;
			}
		}

		for (let i = 1; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] == '^') {
					if (beamLocations[j] != undefined) {
						if (j - 1 >= 0)
							beamLocations[j - 1] = beamLocations[j - 1]
								? beamLocations[j - 1]! + beamLocations[j]!
								: beamLocations[j];
						if (j + 1 < grid[i].length)
							beamLocations[j + 1] = beamLocations[j + 1]
								? beamLocations[j + 1]! + beamLocations[j]!
								: beamLocations[j];
						beamLocations[j] = undefined;
					}
				}
			}
		}

		Object.values(beamLocations).forEach((value) => {
			if (value != undefined) part2 += value;
		});

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 7: Laboratories</h1>

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
