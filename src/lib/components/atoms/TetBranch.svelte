<script lang="ts">
	let { blossom = 'peach' }: { blossom?: 'peach' | 'apricot' } = $props();
	const id = $derived(`tet-${blossom}`);

	// Peach (đào, Northern Tết): flowers sit directly on dark, gnarled wood.
	const peachFlowers = [
		{ x: 62, y: 50, r: -10, s: 1 },
		{ x: 58, y: 26, r: 22, s: 0.82 },
		{ x: 86, y: 86, r: 8, s: 1.05 },
		{ x: 40, y: 112, r: -20, s: 0.8 },
		{ x: 148, y: 64, r: -15, s: 1 },
		{ x: 178, y: 37, r: 12, s: 0.88 },
		{ x: 128, y: 104, r: 30, s: 0.92 },
		{ x: 206, y: 56, r: -5, s: 1.08 },
		{ x: 222, y: 88, r: 15, s: 0.78 }
	];
	const peachBuds = [
		{ x: 63, y: 12, r: 8 },
		{ x: 246, y: 32, r: 62 },
		{ x: 199, y: 19, r: 48 },
		{ x: 146, y: 124, r: 140 },
		{ x: 104, y: 80, r: -28 },
		{ x: 228, y: 98, r: 160 },
		{ x: 26, y: 128, r: -50 },
		{ x: 189, y: 63, r: 24 },
		{ x: 70, y: 70, r: -70 }
	];
	const peachLeaves = [
		{ x: 66, y: 66, r: -58 },
		{ x: 160, y: 66, r: 52 },
		{ x: 214, y: 52, r: -38 },
		{ x: 118, y: 92, r: -84 }
	];

	// Mai vàng (Southern Tết): blooms hang from slender stalks; young leaves are bronze-red.
	const maiFlowers = [
		{ ax: 80, ay: 52, x: 72, y: 39, r: -10, s: 1 },
		{ ax: 108, ay: 28, x: 117, y: 17, r: 15, s: 0.84 },
		{ ax: 57, ay: 96, x: 44, y: 86, r: -25, s: 0.94 },
		{ ax: 125, ay: 90, x: 124, y: 72, r: 5, s: 1.05 },
		{ ax: 90, ay: 99, x: 93, y: 82, r: -18, s: 0.86 },
		{ ax: 188, ay: 40, x: 182, y: 24, r: -5, s: 0.95 },
		{ ax: 214, ay: 28, x: 228, y: 19, r: 25, s: 0.74 },
		{ ax: 214, ay: 62, x: 210, y: 45, r: 12, s: 0.88 },
		{ ax: 128, ay: 132, x: 120, y: 145, r: 40, s: 0.8 },
		{ ax: 224, ay: 104, x: 236, y: 112, r: 20, s: 0.78 }
	];
	const maiBuds = [
		{ ax: 106, ay: 29, x: 99, y: 21, open: false },
		{ ax: 84, ay: 48, x: 91, y: 43, open: true },
		{ ax: 252, ay: 40, x: 256, y: 33, open: false },
		{ ax: 196, ay: 34, x: 198, y: 27, open: false },
		{ ax: 222, ay: 96, x: 214, y: 98, open: true },
		{ ax: 110, ay: 110, x: 104, y: 116, open: false },
		{ ax: 61, ay: 72, x: 54, y: 67, open: false },
		{ ax: 142, ay: 87, x: 142, y: 79, open: true },
		{ ax: 202, ay: 72, x: 196, y: 80, open: false },
		{ ax: 246, ay: 45, x: 244, y: 37, open: true }
	];
	const maiLeaves = [
		{ x: 83, y: 50, r: -70, young: true },
		{ x: 154, y: 82, r: 40, young: false },
		{ x: 236, y: 50, r: -52, young: true },
		{ x: 104, y: 99, r: 122, young: false },
		{ x: 198, y: 70, r: -128, young: true },
		{ x: 60, y: 104, r: -110, young: true }
	];

	const petals = [0, 72, 144, 216, 288];
	const peachStamens = Array.from({ length: 14 }, (_, i) => {
		const a = ((i * 360) / 14 + 8) * (Math.PI / 180);
		const len = 5 + (i % 3) * 1.1;
		return { x: +(Math.cos(a) * len).toFixed(2), y: +(Math.sin(a) * len).toFixed(2) };
	});
	const maiStamens = Array.from({ length: 20 }, (_, i) => {
		const a = ((i * 360) / 20 + 4) * (Math.PI / 180);
		const len = 6.5 + (i % 4) * 0.9;
		return { x: +(Math.cos(a) * len).toFixed(2), y: +(Math.sin(a) * len).toFixed(2) };
	});
</script>

{#snippet envelope(x: number, top: number, length: number, tilt: number)}
	<g class="envelope" transform={`rotate(${tilt} ${x} ${top})`}>
		<path
			d={`M${x} ${top}v${length}`}
			stroke="var(--string)"
			stroke-width="1.2"
			stroke-linecap="round"
		/>
		<circle cx={x} cy={top + length - 1} r="1.8" fill="var(--string)" />
		<g
			transform={`translate(${x - 11} ${top + length})`}
			stroke="var(--envelope-line)"
			stroke-width="1"
			stroke-linejoin="round"
		>
			<rect width="22" height="31" rx="2" fill="var(--envelope)" />
			<path d="M0 2 11 11 22 2" fill="var(--envelope-flap)" />
			<circle cx="11" cy="19" r="4.6" fill="none" stroke="var(--envelope-gold)" />
			<path d="m11 15.8 3.2 3.2-3.2 3.2-3.2-3.2Z" fill="var(--envelope-gold)" stroke="none" />
		</g>
	</g>
{/snippet}

<svg viewBox="0 0 260 158" fill="none" class:apricot={blossom === 'apricot'} aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-petal`} x1="0" y1="1" x2="0" y2="0">
			<stop offset="0" stop-color="var(--petal-deep)" />
			<stop offset=".5" stop-color="var(--petal)" />
			<stop offset="1" stop-color="var(--petal-tip)" />
		</linearGradient>
		<radialGradient id={`${id}-bud`} cx=".4" cy=".35" r=".7">
			<stop offset="0" stop-color="var(--petal-tip)" />
			<stop offset="1" stop-color="var(--petal-deep)" />
		</radialGradient>
	</defs>

	<g class="sway">
		{#if blossom === 'peach'}
			<!-- Gnarled, dark bark of a Nhật Tân peach branch -->
			<g stroke="var(--bark)" stroke-linecap="round" stroke-linejoin="round">
				<path d="M-10 150C30 120 60 92 110 80" stroke-width="7.5" />
				<path d="M110 80C150 71 185 66 220 48" stroke-width="4.8" />
				<path d="M220 48C235 40 245 36 256 30" stroke-width="2.4" />
				<path d="M70 96C72 80 66 62 60 44" stroke-width="3.2" />
				<path d="M60 44C57 34 58 24 62 14" stroke-width="1.8" />
				<path d="M140 73C150 58 160 46 176 34" stroke-width="2.6" />
				<path d="M176 34C184 27 190 22 199 19" stroke-width="1.5" />
				<path d="M110 80C120 96 128 110 145 122" stroke-width="2.4" />
				<path d="M190 60C205 66 215 76 226 96" stroke-width="1.8" />
			</g>
			<g stroke="var(--bark-light)" stroke-linecap="round" opacity=".55">
				<path d="M-6 144C32 116 62 89 110 78" stroke-width="1.4" />
				<path d="M112 78C150 69 184 63 218 46" stroke-width="1" />
			</g>
			<g fill="var(--lichen)">
				<ellipse cx="28" cy="125" rx="2.6" ry="1.4" transform="rotate(-35 28 125)" />
				<ellipse cx="96" cy="84" rx="2" ry="1.1" transform="rotate(-20 96 84)" />
				<ellipse cx="166" cy="66" rx="1.8" ry="1" transform="rotate(-15 166 66)" />
				<circle cx="70" cy="90" r="1.1" />
				<circle cx="128" cy="76" r=".9" />
			</g>
			<g fill="var(--bark-dark)">
				<ellipse cx="70" cy="96" rx="3" ry="2.2" />
				<ellipse cx="140" cy="73" rx="2.4" ry="1.8" />
				<ellipse cx="190" cy="60" rx="1.8" ry="1.4" />
			</g>

			{#each peachLeaves as leaf, i (i)}
				<g transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r})`}>
					<path d="M0 0C3.5-4 3.5-10 0-14C-3.5-10-3.5-4 0 0Z" fill="var(--leaf)" />
					<path d="M0-1V-12" stroke="var(--leaf-vein)" stroke-width=".6" />
				</g>
			{/each}

			{#each peachBuds as bud, i (i)}
				<g transform={`translate(${bud.x} ${bud.y}) rotate(${bud.r})`}>
					<path d="M0 0C-4.2-3-4.4-9 0-12.5C4.4-9 4.2-3 0 0Z" fill={`url(#${id}-bud)`} />
					<path d="M-3.4-1.2Q0-5.4 3.4-1.2Q0 2-3.4-1.2Z" fill="var(--calyx)" />
				</g>
			{/each}

			{#each peachFlowers as flower, i (i)}
				<g transform={`translate(${flower.x} ${flower.y}) rotate(${flower.r}) scale(${flower.s})`}>
					<circle r="4.5" fill="var(--calyx)" />
					{#each petals as rotation (rotation)}
						<g transform={`rotate(${rotation})`}>
							<path
								d="M0 0C-7.5-2-10.5-9-6.6-13.4C-4.4-15.6-1.3-14.8 0-12.6C1.3-14.8 4.4-15.6 6.6-13.4C10.5-9 7.5-2 0 0Z"
								fill={`url(#${id}-petal)`}
								stroke="var(--petal-line)"
								stroke-width=".55"
							/>
							<path
								d="M0-2.5V-10M-2.6-3.5-4-9M2.6-3.5 4-9"
								stroke="var(--petal-line)"
								stroke-width=".4"
								opacity=".45"
							/>
						</g>
					{/each}
					<circle r="3.4" fill="var(--heart)" />
					{#each peachStamens as st, j (j)}
						<path d={`M0 0L${st.x} ${st.y}`} stroke="var(--filament)" stroke-width=".55" />
						<circle cx={st.x} cy={st.y} r=".85" fill="var(--anther)" />
					{/each}
					<circle r="1" fill="var(--pistil)" />
				</g>
			{/each}

			{@render envelope(168, 66, 24, 4)}
		{:else}
			<!-- Slender, pale mai twigs -->
			<g stroke="var(--bark)" stroke-linecap="round" stroke-linejoin="round">
				<path d="M-10 146C40 118 80 100 125 90" stroke-width="5.6" />
				<path d="M125 90C165 81 200 70 236 50" stroke-width="3.4" />
				<path d="M236 50C245 45 252 40 258 36" stroke-width="1.6" />
				<path d="M57 112C55 92 63 70 80 52" stroke-width="2.4" />
				<path d="M80 52C88 42 96 34 108 28" stroke-width="1.4" />
				<path d="M150 84C160 66 170 52 188 40" stroke-width="2" />
				<path d="M188 40C196 34 204 30 214 28" stroke-width="1.2" />
				<path d="M100 96C112 110 118 122 128 132" stroke-width="1.8" />
				<path d="M200 70C212 78 220 90 224 104" stroke-width="1.4" />
			</g>
			<path
				d="M-6 141C42 114 82 97 125 88"
				stroke="var(--bark-light)"
				stroke-width="1.2"
				stroke-linecap="round"
				opacity=".55"
			/>

			<!-- Flower stalks -->
			<g stroke="var(--stalk)" stroke-width=".9" stroke-linecap="round">
				{#each maiFlowers as f, i (i)}
					<path
						d={`M${f.ax} ${f.ay}Q${(f.ax + f.x) / 2 + 3} ${(f.ay + f.y) / 2} ${f.x} ${f.y}`}
					/>
				{/each}
				{#each maiBuds as b, i (i)}
					<path d={`M${b.ax} ${b.ay}L${b.x} ${b.y}`} />
				{/each}
			</g>

			{#each maiLeaves as leaf, i (i)}
				<g transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r})`}>
					<path
						d="M0 0C4.5-5 4.5-14 0-19C-4.5-14-4.5-5 0 0Z"
						fill={leaf.young ? 'var(--loc)' : 'var(--leaf)'}
					/>
					<path
						d="M0-1V-17"
						stroke={leaf.young ? 'var(--loc-vein)' : 'var(--leaf-vein)'}
						stroke-width=".6"
					/>
				</g>
			{/each}

			{#each maiBuds as b, i (i)}
				<g transform={`translate(${b.x} ${b.y})`}>
					<circle r={b.open ? 3.3 : 2.7} fill={b.open ? `url(#${id}-bud)` : 'var(--bud-green)'} />
					<path
						d="M-2.4 1.6Q0-1 2.4 1.6"
						stroke="var(--sepal)"
						stroke-width="1"
						stroke-linecap="round"
					/>
				</g>
			{/each}

			{#each maiFlowers as flower, i (i)}
				<g transform={`translate(${flower.x} ${flower.y}) rotate(${flower.r}) scale(${flower.s})`}>
					{#each petals as rotation (rotation)}
						<path d="M0 0-2.6-6.5 0-8.4 2.6-6.5Z" fill="var(--sepal)" transform={`rotate(${rotation + 36})`} />
					{/each}
					{#each petals as rotation (rotation)}
						<path
							d="M0-1.5C-5.4-4.5-7.6-11.6-4.4-15.2C-2.2-17.4 2.2-17.4 4.4-15.2C7.6-11.6 5.4-4.5 0-1.5Z"
							fill={`url(#${id}-petal)`}
							stroke="var(--petal-line)"
							stroke-width=".5"
							transform={`rotate(${rotation})`}
						/>
					{/each}
					{#each maiStamens as st, j (j)}
						<path d={`M0 0L${st.x} ${st.y}`} stroke="var(--filament)" stroke-width=".5" />
						<ellipse cx={st.x} cy={st.y} rx=".9" ry=".7" fill="var(--anther)" />
					{/each}
					<circle r="2.1" fill="var(--pistil)" />
				</g>
			{/each}

			{@render envelope(165, 82, 22, -3)}
		{/if}
	</g>
</svg>

<style>
	svg {
		/* Peach — đào phai / bích đào */
		--bark: #5e4038;
		--bark-dark: #45302a;
		--bark-light: #9b7a6c;
		--lichen: #b7b89a;
		--leaf: #9cbf7d;
		--leaf-vein: #6f9555;
		--petal-deep: #d9577f;
		--petal: #f39ab5;
		--petal-tip: #fde4ec;
		--petal-line: #c45f82;
		--heart: #a8344f;
		--calyx: #8c3a3c;
		--filament: #e77d9c;
		--anther: #f2c84b;
		--pistil: #b8c77a;
		--string: #c9464f;
		--envelope: #cf3f4a;
		--envelope-flap: #b8323d;
		--envelope-line: #932a33;
		--envelope-gold: #f2cf73;
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.apricot {
		/* Mai vàng — Ochna integerrima */
		--bark: #8a6e5b;
		--bark-light: #c3a993;
		--stalk: #8f8150;
		--leaf: #8fb06a;
		--leaf-vein: #648446;
		--loc: #b8613f;
		--loc-vein: #8a3f27;
		--petal-deep: #f0a81e;
		--petal: #fbcf33;
		--petal-tip: #fff0a6;
		--petal-line: #d39a1c;
		--sepal: #6f9a4a;
		--bud-green: #9fbf62;
		--filament: #e8a52a;
		--anther: #b4501f;
		--pistil: #7ea24a;
	}
	.sway {
		transform-box: view-box;
		transform-origin: 0% 95%;
		animation: branch-sway 7s ease-in-out infinite alternate;
	}
	@keyframes branch-sway {
		from {
			transform: rotate(-0.6deg);
		}
		to {
			transform: rotate(0.8deg);
		}
	}
	:global(html.dark) svg {
		--bark: #8d6b60;
		--bark-dark: #6b4f46;
		--bark-light: #b89a8c;
		--lichen: #8f9478;
		--petal-deep: #c9567a;
		--petal: #e597b0;
		--petal-tip: #f6d3df;
		--envelope: #b8424c;
		--envelope-flap: #a3363f;
	}
	:global(html.dark) svg.apricot {
		--bark: #a88a76;
		--bark-light: #cdb6a2;
		--petal-deep: #dc9c25;
		--petal: #efc547;
		--petal-tip: #faeaa6;
		--loc: #c47454;
	}
	@media (prefers-reduced-motion: reduce) {
		.sway {
			animation: none;
		}
	}
</style>
