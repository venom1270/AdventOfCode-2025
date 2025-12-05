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

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const grid = data.split('\n').map((b) => b.replace('\r', ''));

		const start1 = performance.now();

		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] != '@') continue;

				let adjacentCount = 0;

				if (i > 0 && grid[i - 1][j] == '@') adjacentCount++;
				if (j > 0 && grid[i][j - 1] == '@') adjacentCount++;
				if (i + 1 < grid.length && grid[i + 1][j] == '@') adjacentCount++;
				if (j + 1 < grid[i].length && grid[i][j + 1] == '@') adjacentCount++;
				if (i > 0 && j > 0 && grid[i - 1][j - 1] == '@') adjacentCount++;
				if (i > 0 && j + 1 < grid[i].length && grid[i - 1][j + 1] == '@') adjacentCount++;
				if (i + 1 < grid.length && j > 0 && grid[i + 1][j - 1] == '@') adjacentCount++;
				if (i + 1 < grid.length && j + 1 < grid[i].length && grid[i + 1][j + 1] == '@')
					adjacentCount++;

				if (adjacentCount < 4) {
					part1++;
				}
			}
		}

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		let removed = 0;
		do {
			removed = 0;
			for (let i = 0; i < grid.length; i++) {
				for (let j = 0; j < grid[i].length; j++) {
					if (grid[i][j] != '@') continue;

					let adjacentCount = 0;

					if (i > 0 && grid[i - 1][j] == '@') adjacentCount++;
					if (j > 0 && grid[i][j - 1] == '@') adjacentCount++;
					if (i + 1 < grid.length && grid[i + 1][j] == '@') adjacentCount++;
					if (j + 1 < grid[i].length && grid[i][j + 1] == '@') adjacentCount++;
					if (i > 0 && j > 0 && grid[i - 1][j - 1] == '@') adjacentCount++;
					if (i > 0 && j + 1 < grid[i].length && grid[i - 1][j + 1] == '@') adjacentCount++;
					if (i + 1 < grid.length && j > 0 && grid[i + 1][j - 1] == '@') adjacentCount++;
					if (i + 1 < grid.length && j + 1 < grid[i].length && grid[i + 1][j + 1] == '@')
						adjacentCount++;

					if (adjacentCount < 4) {
						grid[i] = grid[i].substring(0, j) + 'x' + grid[i].substring(j + 1);
						part2++;
						removed++;
					}
				}
			}
		} while (removed > 0);

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 4: Printing Department</h1>

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
