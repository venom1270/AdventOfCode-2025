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
		let s = data.split('\n').map((b) => b.replace('\r', ''));
		let d = [];
		s.forEach((line: string) => {
			d.push(line.split(',').map((l) => parseInt(l)));
		});
		return d;
	}

	function calculateDistance(p1: number[], p2: number[]): number {
		return Math.sqrt(
			Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2)
		);
	}

	function calculateAllDistances(points: number[][]): number[][] {
		let distances: number[][] = Array.from({ length: points.length }, () =>
			Array(points.length).fill(0)
		);

		for (let i = 0; i < points.length; i++) {
			let p1 = points[i];
			for (let j = i + 1; j < points.length; j++) {
				let p2 = points[j];
				distances[i][j] = calculateDistance(p1, p2);
			}
		}

		return distances;
	}

	function findShortestDistance(distances: number[][], connected: number[]): number[] {
		let shortest = 99999999999999999;
		let index: number[] = [-1, -1];
		for (let i = 0; i < distances.length; i++) {
			for (let j = i + 1; j < distances.length; j++) {
				//if (connected.includes(i) && connected.includes(j)) continue;
				if (distances[i][j] != 0 && distances[i][j] < shortest) {
					shortest = distances[i][j];
					index[0] = i;
					index[1] = j;
				}
			}
		}

		if (index[0] != -1) {
			distances[index[0]][index[1]] = 0;
		}
		/*for (let i = 0; i < distances.length; i++) {
			distances[index[0]][i] = 0;
		}*/

		return index;
	}

	function findCircuit(circuits: number[][], index: number[]): number[] {
		let x = -1,
			y = -1;
		for (let i = 0; i < circuits.length; i++) {
			for (let j = 0; j < circuits[i].length; j++) {
				if (circuits[i][j] == index[0]) {
					x = i;
				} else if (circuits[i][j] == index[1]) {
					y = i;
				}
			}
		}

		return [x, y];
	}

	function addToCircuit(circuit: number[], i: number, connected: number[]) {
		for (const c of circuit) {
			if (c == i) return;
		}
		circuit.push(i);
		connected.push(i);
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const points = parse();

		//console.log(points);

		const start1 = performance.now();

		let circuits: number[][] = [];
		let connected: number[] = [];
		let distances = calculateAllDistances(points);
		//console.log(distances);

		for (let i = 0; i < 1000; i++) {
			// Find shortest distance and form a circuit
			let index = findShortestDistance(distances, connected);
			if (index[0] == -1) break;
			let circuitIndex = findCircuit(circuits, index);

			if (circuitIndex[0] == -1 && circuitIndex[1] == -1) {
				//console.log('Making new circuit', index[0], index[1]);
				circuits.push([index[0], index[1]]);
				connected.push(index[0]);
				connected.push(index[1]);
			} else if (circuitIndex[0] == -1) {
				//console.log('Adding to circuit (1)', index[0], index[1]);
				addToCircuit(circuits[circuitIndex[1]], index[0], connected);
			} else if (circuitIndex[1] == -1) {
				//console.log('Adding to circuit (2)', index[0], index[1]);
				addToCircuit(circuits[circuitIndex[0]], index[1], connected);
			} else if (circuitIndex[0] != circuitIndex[1]) {
				//console.log('Merging circuits', index[0], index[1]);
				// Merge circuits - 1 to 0
				circuits[circuitIndex[0]].push(...circuits[circuitIndex[1]]);
				circuits.splice(circuitIndex[1], 1);
			} else {
				//console.log('Nothing happnes!', index[0], index[1]);
			}
		}

		//console.log(circuits);
		//console.log(connected);

		circuits.sort((a, b) => b.length - a.length);

		part1 = 1;
		for (let i = 0; i < 3; i++) {
			part1 *= circuits[i].length;
		}

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		circuits = [];
		connected = [];
		distances = calculateAllDistances(points);
		//console.log(distances);

		let lastIndex: number[] = [];
		for (let i = 0; circuits.length > 1 || connected.length < points.length; i++) {
			// Find shortest distance and form a circuit
			let index = findShortestDistance(distances, connected);
			if (index[0] == -1) break;
			lastIndex = index;
			let circuitIndex = findCircuit(circuits, index);

			if (circuitIndex[0] == -1 && circuitIndex[1] == -1) {
				//console.log('Making new circuit', index[0], index[1]);
				circuits.push([index[0], index[1]]);
				connected.push(index[0]);
				connected.push(index[1]);
			} else if (circuitIndex[0] == -1) {
				//console.log('Adding to circuit (1)', index[0], index[1]);
				addToCircuit(circuits[circuitIndex[1]], index[0], connected);
			} else if (circuitIndex[1] == -1) {
				//console.log('Adding to circuit (2)', index[0], index[1]);
				addToCircuit(circuits[circuitIndex[0]], index[1], connected);
			} else if (circuitIndex[0] != circuitIndex[1]) {
				//console.log('Merging circuits', index[0], index[1]);
				// Merge circuits - 1 to 0
				circuits[circuitIndex[0]].push(...circuits[circuitIndex[1]]);
				circuits.splice(circuitIndex[1], 1);
			} else {
				//console.log('Nothing happnes!', index[0], index[1]);
			}
		}

		//console.log(circuits);
		//console.log(connected);

		//console.log(lastIndex, points[lastIndex[0]], points[lastIndex[1]]);

		part2 = points[lastIndex[0]][0] * points[lastIndex[1]][0];

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 8: Playground</h1>

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
