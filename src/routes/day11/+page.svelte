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
		let d: string[][] = [];
		s.forEach((line: string) => {
			d.push(line.replace(':', '').split(' '));
		});
		return d;
	}

	type Graph = Record<string, string[]>;

	function findPaths(g: Graph, n: string, visited: string[]): number {
		if (n == 'out') return 1;

		if (visited.includes(n)) return 0;

		if (g[n] == undefined) return 0;

		let p = 0;
		for (let connection of g[n]) {
			p += findPaths(g, connection, [...visited, n]);
		}

		return p;
	}

	let memo: Record<string, number> = {};
	function findPathsPart2(g: Graph, n: string, end: string): number {
		if (n == end) {
			/*/if (visited.includes('dac') && visited.includes('fft')) {
				//if (memo[n] == undefined) memo[n] = 1;
				//else memo[n]++;
				return 1;
			} else return 0;*/
			return 1;
		}

		if (memo[n] != undefined) {
			return memo[n];
		}
		if (g[n] == undefined) return 0;

		let p = 0;
		for (let connection of g[n]) {
			p += findPathsPart2(g, connection, end);
		}

		memo[n] = p;

		return p;
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const input = parse();

		let graph: Graph = {};
		for (let i of input) {
			graph[i[0]] = i.slice(1);
		}

		console.log(graph);

		const start1 = performance.now();

		part1 = findPaths(graph, 'you', []);

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		part2 = findPathsPart2(graph, 'svr', 'out');

		memo = {};
		let svrToDac = findPathsPart2(graph, 'svr', 'dac');
		memo = {};
		let svrToFft = findPathsPart2(graph, 'svr', 'fft');
		memo = {};
		let dacToFft = findPathsPart2(graph, 'dac', 'fft');
		memo = {};
		let fftToDac = findPathsPart2(graph, 'fft', 'dac');
		memo = {};
		let dacToOut = findPathsPart2(graph, 'dac', 'out');
		memo = {};
		let fftToOut = findPathsPart2(graph, 'fft', 'out');

		part2 = svrToDac * dacToFft * fftToOut + svrToFft * fftToDac * dacToOut;

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 11: Reactor</h1>

<input type="file" onchange={processFile} />
<br />
<button onclick={solve} disabled={data == ''}>Solve</button>

{#if solving}
	Solving...
{:else if part1 != 0 || part2 != 0}
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
