<script lang="ts">
	let data: string = $state('');
	let part1 = $state(0);
	let part2 = $state(0);

	let part1Time = $state('');
	let part2Time = $state('');

	type Machine = {
		finalLights: boolean[];
		currentLights: boolean[];

		buttons: number[][];

		joltage: number[];
		joltageCounters: number[];
	};

	type State = {
		machine: Machine;
		steps: number;
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
		let d: Machine[] = [];
		s.forEach((line: string) => {
			let l = line.split(' ');

			let finalLights: boolean[] = [];

			for (let i = 1; i + 1 < l[0].length; i++) {
				if (l[0][i] == '#') finalLights.push(true);
				else finalLights.push(false);
			}

			let buttons: number[][] = [];
			for (let i = 1; i + 1 < l.length; i++) {
				let b = l[i]
					.slice(1, l[i].length - 1)
					.split(',')
					.map((x) => parseInt(x));
				buttons.push(b);
			}

			let joltage: number[] = l[l.length - 1]
				.slice(1, l[l.length - 1].length - 1)
				.split(',')
				.map((x) => parseInt(x));

			d.push({
				buttons,
				joltage,
				finalLights,
				currentLights: Array(finalLights.length).fill(false),
				joltageCounters: Array(finalLights.length).fill(0)
			});
		});
		return d;
	}

	function copy(m: Machine): Machine {
		return {
			finalLights: [...m.finalLights],
			currentLights: [...m.currentLights],
			buttons: m.buttons.map((row) => [...row]),
			joltage: [...m.joltage],
			joltageCounters: [...m.joltageCounters]
		};
	}

	function pressButton(m: Machine, buttons: number[]) {
		for (let b of buttons) {
			m.currentLights[b] = !m.currentLights[b];
		}
	}

	function pressButtonJoltage(m: Machine, buttons: number[]): number {
		for (let b of buttons) {
			m.joltageCounters[b]++;
		}
	}

	function isFinal(m: Machine): boolean {
		for (let i = 0; i < m.currentLights.length; i++) {
			if (m.currentLights[i] != m.finalLights[i]) return false;
		}
		return true;
	}

	function isFinalJoltage(m: Machine): boolean {
		for (let i = 0; i < m.joltageCounters.length; i++) {
			if (m.joltageCounters[i] != m.joltage[i]) return false;
		}
		return true;
	}

	function isSameArray(x: any[], y: any[]): boolean {
		if (x.length != y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (x[i] != y[i]) return false;
		}
		return true;
	}

	let rmemo: number[][] = [];
	function rec(state: State): State | undefined {
		let m = state.machine;
		for (let j = 0; j < m.joltageCounters.length; j++) {
			if (m.joltageCounters[j] > m.joltage[j]) {
				return undefined;
			}
		}

		if (rmemo.filter((rm) => isSameArray(rm, m.joltageCounters)).length > 0) return undefined;

		rmemo.push(m.joltageCounters);

		if (isFinalJoltage(m)) return state;

		for (const b of m.buttons) {
			let c = copy(m);
			pressButtonJoltage(c, b);
			let r = rec({ machine: c, steps: state.steps + 1 });
			if (r != undefined) return r;
		}

		return undefined;
	}

	function solve() {
		solving = true;
		part1 = 0;
		part2 = 0;

		const machines = parse();

		console.log(machines);

		const start1 = performance.now();

		let count = 1;
		for (let machine of machines) {
			let queue: State[] = [{ machine, steps: 0 }];
			let done = false;
			let memo: boolean[][] = [];

			console.log(count++, machine);

			while (!done && queue.length > 0) {
				const currentState = queue.shift()!;
				const m = currentState.machine;

				if (memo.filter((mem) => isSameArray(mem, m.currentLights)).length > 0) continue;

				memo.push(m.currentLights);

				for (let b of m.buttons) {
					let c = copy(currentState?.machine);
					pressButton(c, b);
					if (isFinal(c)) {
						done = true;
						part1 += currentState.steps + 1;
						break;
					}
					queue.push({ machine: c, steps: currentState.steps + 1 });
				}
			}
		}

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		count = 1;
		for (let machine of machines) {
			machine.buttons.sort((a, b) => b.length - a.length);
			console.log(count++, machine);
			let r = rec({ machine, steps: 0 });
			console.log(r);
			if (r != undefined) {
				part2 += r.steps;
			}

			/*while (!done && queue.length > 0) {
				const currentState = queue.shift()!;
				const m = currentState.machine;

				if (memo.filter((mem) => isSameArray(mem, m.joltageCounters)).length > 0) continue;
				let skip = false;
				for (let j = 0; j < m.joltageCounters.length; j++) {
					if (m.joltageCounters[j] > m.joltage[j]) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				memo.push(m.joltageCounters);

				for (let b of m.buttons) {
					let c = copy(currentState?.machine);
					pressButtonJoltage(c, b);
					if (isFinalJoltage(c)) {
						done = true;
						part2 += currentState.steps + 1;
						break;
					}
					queue.push({ machine: c, steps: currentState.steps + 1 });
				}
			}*/
		}

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 10: Factory</h1>

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
