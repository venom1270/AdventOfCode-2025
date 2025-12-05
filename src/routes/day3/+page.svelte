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

		const batteries = data.split('\n').map((b) => b.replace('\r', ''));

		const start1 = performance.now();

		for (const b of batteries) {
			let max1 = '0',
				max2 = '0';
			for (let i = 0; i < b.length; i++) {
				const c = b[i];
				if (c > max1 && i + 1 < b.length) {
					max1 = c;
					max2 = '0';
				} else if (c > max2) {
					max2 = c;
				}
			}

			part1 += parseInt(max1) * 10 + parseInt(max2);
		}

		const end1 = performance.now();
		part1Time = (end1 - start1).toFixed(1);

		const start2 = performance.now();

		for (const b of batteries) {
			let maxList = '0'.repeat(12).split('');
			for (let i = 0; i < b.length; i++) {
				const c = b[i];

				for (let mi = 0; mi < maxList.length; mi++) {
					if (c > maxList[mi] && maxList.length - mi + i - 1 < b.length) {
						maxList[mi] = c;
						for (let mii = mi + 1; mii < maxList.length; mii++) {
							maxList[mii] = '0';
						}
						break;
					}
				}
			}
			part2 += maxList.reduce((acc, val) => acc * 10 + parseInt(val), 0);
		}

		const end2 = performance.now();
		part2Time = (end2 - start2).toFixed(1);

		console.log(part1);
		console.log(part2);

		solving = false;
	}
</script>

<h1>Day 3: Lobby</h1>

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
