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
		let input: string[][] = [];
		p.forEach((line) => {
			let s = line.trim().split(/\s+/);
			input.push(s);
		});

		return input;
	}

	function parse2() {
		const p = data.split('\n').map((b) => b.replace('\r', ''));
		let input: string[][] = [];

		let indexes: number[] = [];
		// Split by columns consisting only of spaces
		for (let i = 0; i < p[0].length; i++) {
			let ok = true;
			for (let j = 0; j < p.length; j++) {
				if (p[j][i] != ' ') {
					ok = false;
					break;
				}
			}
			if (ok) {
				indexes.push(i);
			}
		}

		p.forEach((line) => {
			let l: string[] = [];
			let prev = 0;
			indexes.forEach((i) => {
				l.push(line.slice(prev, i));
				prev = i + 1;
			});
			l.push(line.slice(prev, line.length));
			input.push(l);
		});

		return input;
	}

	function transform(input: string[][]): string[][] {
		let s: string[][] = [];

		for (let i = 0; i < input[0].length; i++) {
			let nums: string[] = [input[input.length - 1][i][0]]; // Operaion char
			for (let index = 0; index < input[0][i].length; index++) {
				let num = '';
				for (let j = 0; j < input.length - 1; j++) {
					if (input[j][i][index] != ' ') {
						num += input[j][i][index];
					}
				}
				nums.push(num);
			}
			s.push(nums);
		}

		return s;
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const start1 = performance.now();

		const input = parse();

		let results: number[] = [];
		for (let i = 0; i < input[0].length; i++) {
			let r = 0;
			if (input[input.length - 1][i] == '+') {
				for (let j = 0; j < input.length - 1; j++) {
					r += parseInt(input[j][i]);
				}
			} else {
				r = 1;
				for (let j = 0; j < input.length - 1; j++) {
					r *= parseInt(input[j][i]);
				}
			}
			results.push(r);
		}

		part1 = results.reduce((a, b) => a + b, 0);

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		const input2 = parse2();
		const transformed = transform(input2);

		results = [];
		for (let i = 0; i < transformed.length; i++) {
			let r = 0;
			if (transformed[i][0] == '*') r = 1;
			for (let j = 1; j < transformed[i].length; j++) {
				if (transformed[i][0] == '+') {
					r += parseInt(transformed[i][j]);
				} else {
					r *= parseInt(transformed[i][j]);
				}
			}
			results.push(r);
		}

		part2 = results.reduce((a, b) => a + b, 0);

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 6: Trash Compactor</h1>

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
