<script lang="ts">
	import type { Season } from '$lib/seasonal';
	import ChristmasLights from './ChristmasLights.svelte';
	let { season }: { season: Season } = $props();
</script>

{#if season === 'christmas'}
	<ChristmasLights />
{:else}
	{@const tet = season === 'tet'}
	{@const h = tet ? 50 : 42}
	<svg class="holiday-garland" width="100%" height={h} aria-hidden="true">
		<defs>
			<radialGradient id="tet-lantern-red" cx=".38" cy=".35" r=".8">
				<stop offset="0" stop-color="#f0434f" />
				<stop offset=".55" stop-color="#d4202f" />
				<stop offset="1" stop-color="#a30f22" />
			</radialGradient>
			<linearGradient id="tet-envelope-red" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#e53340" />
				<stop offset="1" stop-color="#b8182a" />
			</linearGradient>
			<pattern id="holiday-garland-pattern" width="180" height={h} patternUnits="userSpaceOnUse">
				<path
					d="M0 2Q45 14 90 2Q135 14 180 2"
					fill="none"
					stroke="var(--festive-gold)"
					stroke-width="1.2"
				/>
				{#if tet}
					<!-- Mai and đào blossoms resting on the string, with small leaves -->
					{#each [{ x: 22.5, mai: true }, { x: 67.5, mai: false }, { x: 112.5, mai: false }, { x: 157.5, mai: true }] as b (b.x)}
						<g transform={`translate(${b.x} 6.5)`}>
							<path d="M0 0C4-1 7 0 9 3C5 4 2 3 0 0Z" fill="#9cbf7d" />
							<path d="M0 0C-4-1-7 0-9 3C-5 4-2 3 0 0Z" fill="#9cbf7d" />
							<g
								fill={b.mai ? '#fbcf33' : '#f39ab5'}
								stroke={b.mai ? '#d39a1c' : '#c45f82'}
								stroke-width=".5"
							>
								{#each [0, 72, 144, 216, 288] as r (r)}
									<ellipse cy="-3.2" rx="2.7" ry="3.3" transform={`rotate(${r})`} />
								{/each}
							</g>
							<circle r="1.6" fill={b.mai ? '#b4501f' : '#f2c84b'} />
						</g>
					{/each}

					<!-- Đèn lồng: gold caps, ribbed body, glow, hanging tassel -->
					{#each [45, 135] as x (x)}
						<g transform={`translate(${x} 0)`}>
							<path d="M0 8V12" stroke="var(--festive-gold)" stroke-width="1.2" />
							<rect
								x="-5"
								y="11.5"
								width="10"
								height="3.2"
								rx="1.2"
								fill="var(--festive-gold)"
							/>
							<ellipse cy="24" rx="11.5" ry="9.5" fill="url(#tet-lantern-red)" />
							<g
								fill="none"
								stroke="var(--festive-gold)"
								stroke-width=".7"
								stroke-opacity=".75"
							>
								<ellipse cy="24" rx="7.5" ry="9.5" />
								<ellipse cy="24" rx="3.4" ry="9.5" />
								<path d="M0 14.5V33.5" />
							</g>
							<ellipse cx="-4.5" cy="20" rx="2.4" ry="4.2" fill="#fff" opacity=".22" />
							<path
								d="m0 20.8 2.9 3.2L0 27.2-2.9 24Z"
								fill="var(--festive-gold)"
							/>
							<rect
								x="-5"
								y="33.3"
								width="10"
								height="3"
								rx="1.2"
								fill="var(--festive-gold)"
							/>
							<g stroke="var(--festive-gold)" stroke-linecap="round">
								<path d="M0 36.3V38.5" stroke-width="1" />
								<path d="M-3 40.5Q0 37.5 3 40.5M-2.2 40v7m2.2-7.5v8m2.2-7.5v7" stroke-width=".9" />
								<circle cy="39" r="1.5" fill="var(--festive-red)" stroke-width=".7" />
							</g>
						</g>
					{/each}

					<!-- Lì xì envelope with gold coin seal and tassel -->
					<g transform="translate(90 0)">
						<path d="M0 2V9" stroke="var(--festive-gold)" stroke-width="1.2" />
						<g stroke="var(--festive-gold)" stroke-width="1" stroke-linejoin="round">
							<rect x="-9" y="9" width="18" height="26" rx="1.8" fill="url(#tet-envelope-red)" />
							<path d="M-9 10.5 0 19 9 10.5" fill="#000" fill-opacity=".14" />
							<circle cy="25" r="4.2" fill="none" stroke-opacity=".9" />
							<path
								d="m0 22 3 3-3 3-3-3Z"
								fill="var(--festive-gold)"
								stroke="none"
							/>
						</g>
						<g stroke="var(--festive-gold)" stroke-linecap="round">
							<path d="M0 35v2" stroke-width="1" />
							<circle cy="38.5" r="1.4" fill="var(--festive-gold)" stroke="none" />
							<path d="M-1.6 40l-1 5M0 40v6M1.6 40l1 5" stroke-width=".8" />
						</g>
					</g>
				{:else}
					<path d="M45 10v7m90-7v7" stroke="var(--festive-gold)" stroke-width="1.2" />
					<path d="m45 17 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="var(--festive-gold)" />
					<path d="m135 17 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="var(--accent)" />
				{/if}
			</pattern>
		</defs>
		<rect width="100%" height={h} fill="url(#holiday-garland-pattern)" />
	</svg>
{/if}

<style>
	.holiday-garland {
		position: absolute;
		top: calc(100% - 3px);
		left: 0;
		pointer-events: none;
	}
</style>
