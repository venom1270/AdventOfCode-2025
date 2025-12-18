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

	function isPointInside(p: Point, a: Point, b: Point): boolean {
		let i = false,
			j = false;
		if (a.i > b.i) {
			if (p.i > b.i && p.i < a.i) i = true;
		} else {
			if (p.i < b.i && p.i > a.i) i = true;
		}

		if (a.j > b.j) {
			if (p.j > b.j && p.j < a.j) j = true;
		} else {
			if (p.j < b.j && p.j > a.j) j = true;
		}

		return i && j;
	}

	function isLineInside(l1: Point, l2: Point, a: Point, b: Point): boolean {
		if (l1.i == l2.i) {
			if (l1.j > l2.j) {
				for (let x = l2.j; x <= l1.j; x++) {
					if (isPointInside({ i: l1.i, j: x }, a, b)) return true;
				}
			} else {
				for (let x = l1.j; x <= l2.j; x++) {
					if (isPointInside({ i: l1.i, j: x }, a, b)) return true;
				}
			}
		} else {
			if (l1.i > l2.i) {
				for (let x = l2.i; x <= l1.i; x++) {
					if (isPointInside({ i: x, j: l1.j }, a, b)) return true;
				}
			} else {
				for (let x = l1.i; x <= l2.i; x++) {
					if (isPointInside({ i: x, j: l1.j }, a, b)) return true;
				}
			}
		}

		return false;
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const points = parse();

		console.log(points);

		const start1 = performance.now();

		let biggestArea = 0;
		let p1: Point = { i: 0, j: 0 };
		let p2: Point = { i: 0, j: 0 };
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
				if (area <= biggestArea) continue;
				let p1_tmp = points[i];
				let p2_tmp = points[j];
				// CHeck if area valid - if line pierces the area, it's not good
				let ok = true;
				for (let k = 0; k < points.length; k++) {
					//if (k == i || k + 1 == i || k == j || k + 1 == j) continue;
					let l1 = points[k];
					let l2;
					if (k + 1 == points.length) l2 = points[0];
					else l2 = points[k + 1];

					if (isLineInside(l1, l2, p1_tmp, p2_tmp)) {
						// != inside2) {
						// Line intersects!! NOT OK!
						ok = false;
						break;
					}
				}
				if (ok) {
					if (area > biggestArea) {
						biggestArea = area;
						p1 = p1_tmp;
						p2 = p2_tmp;
					}
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
