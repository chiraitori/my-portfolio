<script lang="ts">
	let { blossom = 'peach' }: { blossom?: 'peach' | 'apricot' } = $props();
	const flowers = [
		{ x: 36, y: 77, r: -12, s: 0.8 },
		{ x: 66, y: 46, r: 18, s: 1 },
		{ x: 98, y: 72, r: -8, s: 0.9 },
		{ x: 130, y: 30, r: 28, s: 0.8 },
		{ x: 160, y: 61, r: 5, s: 1.1 },
		{ x: 195, y: 38, r: -12, s: 0.85 },
		{ x: 229, y: 64, r: 20, s: 0.7 },
		{ x: 135, y: 100, r: -20, s: 0.7 }
	];
</script>

<svg viewBox="0 0 260 158" fill="none" class:apricot={blossom === 'apricot'} aria-hidden="true">
	<g stroke="var(--twig)" stroke-linecap="round" stroke-linejoin="round">
		<path d="M-7 145Q53 71 157 65q48-6 89-30" stroke-width="4" />
		<path
			d="M30 111 36 77m13 15L66 46m26 28 38-44m-8 39 13 31m26-35 34-27m15 12 19 14M66 46l-9-18m73 2 17-16"
			stroke-width="2"
		/>
	</g>
	<g fill="var(--leaf)" stroke="var(--twig)" stroke-width=".8">
		<path
			d="M83 81Q62 85 66 67q13 0 17 14ZM176 61q-5-20 12-22 3 13-12 22ZM110 74q14 1 17 15-16 3-17-15Z"
		/>
	</g>
	{#each flowers as flower}
		<g transform={`translate(${flower.x} ${flower.y}) rotate(${flower.r}) scale(${flower.s})`}>
			<g fill="var(--petal)" stroke="var(--petal-line)" stroke-width="1.2">
				{#each [0, 72, 144, 216, 288] as rotation}
					<path
						d="M0 1C-12-4-10-16-3-14L0-12l3-2C10-16 12-4 0 1Z"
						transform={`rotate(${rotation})`}
					/>
				{/each}
			</g>
			<circle r="4" fill="var(--pollen)" />
			<path
				d="M0-6v3m5 1-3 1m1 5-2-3m-5 3 2-3m-4-3 3 1"
				stroke="var(--petal-line)"
				stroke-width="1"
				stroke-linecap="round"
			/>
		</g>
	{/each}
	<g fill="var(--petal)" stroke="var(--petal-line)" stroke-width="1">
		<ellipse cx="56" cy="25" rx="3" ry="6" transform="rotate(-25 56 25)" />
		<ellipse cx="149" cy="13" rx="3" ry="5" transform="rotate(35 149 13)" />
		<path d="M208 107q9-12 14-3-3 11-14 3ZM77 135q6-9 10-3-2 8-10 3Z" />
	</g>
	<!-- A little lucky envelope tied to the branch. -->
	<path
		d="M174 70v30m-4-25q4-8 8 0m-4 25-3 7m3-7 3 7"
		stroke="var(--festive-gold)"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<g
		transform="rotate(9 175 120)"
		stroke="var(--envelope-line)"
		stroke-width="1.2"
		stroke-linejoin="round"
	>
		<path d="M162 102h26v36h-26Z" fill="var(--envelope)" />
		<path d="m162 102 13 11 13-11" />
		<path d="m175 117 7 7-7 7-7-7Z" fill="var(--pollen)" stroke="none" />
	</g>
</svg>

<style>
	svg {
		--twig: #a08379;
		--leaf: #a9bea0;
		--petal: #efb9ca;
		--petal-line: #b97894;
		--pollen: #f8db8c;
		--envelope: #cf7c85;
		--envelope-line: #a45c67;
		display: block;
		width: 100%;
		height: auto;
	}
	.apricot {
		--petal: #f5d783;
		--petal-line: #bb994c;
	}
	:global(html.dark) svg {
		--twig: #b5988a;
		--petal: #e7a9c1;
	}
	:global(html.dark) svg.apricot {
		--petal: #edd18b;
	}
</style>
