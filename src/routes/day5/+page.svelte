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
		const p = data.split('\n').map((b) => b.replace('\r', ''));
		let intervals: number[][] = [];
		let ingredients: number[] = [];
		let parsingIntervals = true;
		p.forEach((line) => {
			if (line != '') {
				if (parsingIntervals) {
					let s = line.split('-');
					intervals.push([parseInt(s[0]), parseInt(s[1])]);
				} else {
					ingredients.push(parseInt(line));
				}
			} else {
				parsingIntervals = false;
			}
		});

		return { intervals, ingredients };
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const { intervals, ingredients } = parse();

		const start1 = performance.now();

		// Merge intervals

		intervals.sort((a, b) => {
			if (a[0] < b[0]) return -1;
			else if (a[0] > b[0]) return 1;
			else if (a[1] < b[1]) return -1;
			else if (a[1] > b[1]) return 1;
			else return 0;
		});

		//console.log('Sorted intervals', intervals);

		let mergedIntervals: number[][] = [];
		intervals.forEach((interval) => {
			// Check if it overlaps with any merged intervals
			let l = interval[0];
			let r = interval[1];
			let add = true;
			for (let i = 0; i < mergedIntervals.length; i++) {
				let mi = mergedIntervals[i];
				let ml = mi[0];
				let mr = mi[1];
				if (l > mr) continue;
				if (r < ml) continue;
				if (l <= ml && r >= mr) {
					mergedIntervals[i] = [l, r];
					add = false;
					//break;
				}
				if (l >= ml && r <= mr) {
					add = false;
					break;
				}
				if (l <= ml && r <= mr) {
					add = false;
					mergedIntervals[i][0] = l;
				}
				if (l >= ml && r >= mr) {
					add = false;
					mergedIntervals[i][1] = r;
				}
			}
			if (add) {
				mergedIntervals.push(interval);
			}
		});

		//console.log('Merged intervals', mergedIntervals);

		ingredients.forEach((ingredient) => {
			for (let interval of mergedIntervals) {
				if (interval[0] <= ingredient && interval[1] >= ingredient) {
					part1++;
					break;
				}
			}
		});

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		for (let mi of mergedIntervals) {
			part2 += mi[1] - mi[0] + 1;
		}

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 5: Cafeteria</h1>

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
