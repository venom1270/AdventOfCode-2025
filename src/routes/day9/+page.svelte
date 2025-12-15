<script lang="ts">
	let data: string = $state('');
	let part1 = $state(0);
	let part2 = $state(0);

	let part1Time = $state('');
	let part2Time = $state('');

	type Point = {
		i: number;
		j: number;
	};

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
		let s = data.split('\n').map((b) => b.replace('\r', ''));
		let d: Point[] = [];
		s.forEach((line: string) => {
			let spl = line.split(',').map((l) => parseInt(l));
			d.push({ i: spl[1], j: spl[0] });
		});
		return d;
	}

	function calculateArea(p1: Point, p2: Point): number {
		return (Math.abs(p1.i - p2.i) + 1) * (Math.abs(p1.j - p2.j) + 1);
	}

	function check(p1: Point, p2: Point, curr: Point): boolean {
		if (p1.i > p2.i && p1.j > p2.j) {
			if (curr.i <= p1.i && curr.i >= p2.i && curr.j <= p1.j && curr.j >= p2.j) return false;
		} else if (p1.i < p2.i && p1.j > p2.j) {
			if (curr.i >= p1.i && curr.i <= p2.i && curr.j <= p1.j && curr.j >= p2.j) return false;
		} else if (p1.i > p2.i && p1.j < p2.j) {
			if (curr.i <= p1.i && curr.i >= p2.i && curr.j >= p1.j && curr.j <= p2.j) return false;
		} else if (p1.i < p2.i && p1.j < p2.j) {
			if (curr.i >= p1.i && curr.i <= p2.i && curr.j >= p1.j && curr.j <= p2.j) return false;
		}

		return true;
	}

	function trace(points: Point[], i: number, j: number): boolean {
		const p1 = points[i];
		const p2 = points[j];

		if (i + 1 == points.length) i = -1;
		let curr = points[++i];
		let end = p1;

		//console.log('Testing', p1, p2);

		// Trace until we get to the same point
		while (curr.i != end.i || curr.j != end.j) {
			// Check if trace is still valid
			// Trace is invalid if curr is inside the square AND TODO not covering everything (jumb by more than 1?)
			if (i + 1 == points.length) i = -1;
			let next = points[++i];

			let c = check(p1, p2, curr);
			if (!c) {
				if ((curr.i == p2.i && curr.j == p2.j) || (next.i == p2.i && next.j == p2.j)) {
				} else {
					if (!check(p1, p2, next)) return false;
				}
				//return false;
			}

			curr = next;
		}

		return true;
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const points = parse();

		console.log(points);

		const start1 = performance.now();

		let biggestArea = 0;
		let p1: Point;
		let p2: Point;
		for (let i = 0; i < points.length; i++) {
			for (let j = i + 1; j < points.length; j++) {
				const area = calculateArea(points[i], points[j]);
				if (area > biggestArea) {
					biggestArea = area;
					p1 = points[i];
					p2 = points[j];
				}
			}
		}

		part1 = biggestArea;

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		biggestArea = 0;
		for (let i = 0; i < points.length; i++) {
			for (let j = i + 1; j < points.length; j++) {
				const area = calculateArea(points[i], points[j]);
				if (area > biggestArea && trace(points, i, j)) {
					biggestArea = area;
					p1 = points[i];
					p2 = points[j];
				}
			}
		}

		part2 = biggestArea;

		console.log(p1, p2);

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 9: Movie Theater</h1>

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
