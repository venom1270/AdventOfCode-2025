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

		const ids = data.split(',').map((d) => d.replace('\r', ''));

		const start1 = performance.now();

		for (const idPair of ids) {
			let min = parseInt(idPair.split('-')[0]);
			let max = parseInt(idPair.split('-')[1]);

			for (let i = min; i <= max; i++) {
				let s = i.toString();
				if (s.length % 2 == 0) {
					let ok = true;
					for (let j = 0; j < s.length / 2; j++) {
						if (s[j] != s[j + s.length / 2]) {
							ok = false;
							break;
						}
					}
					if (ok) part1 += i;
				}
			}
		}

		const end1 = performance.now();

		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		for (const idPair of ids) {
			let min = parseInt(idPair.split('-')[0]);
			let max = parseInt(idPair.split('-')[1]);

			for (let i = min; i <= max; i++) {
				let s = i.toString();

				for (let sequenceLength = 1; sequenceLength <= s.length / 2; sequenceLength++) {
					if (s.length % sequenceLength == 0) {
						let ok = true;

						// Start at second occurence and check if it repeats all the way through
						for (let index = sequenceLength; index < s.length; index += sequenceLength) {
							for (let j = 0; j < sequenceLength; j++) {
								if (s[j] != s[j + index]) {
									ok = false;
									break;
								}
							}
							if (!ok) break;
						}
						if (ok) {
							part2 += i;
							break;
						}
					}
				}
			}
		}

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 2: Gift Shop</h1>

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
