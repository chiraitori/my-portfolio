<script lang="ts">
	import type { Season } from '$lib/seasonal';
	import ChristmasLights from './ChristmasLights.svelte';
	let { season }: { season: Season } = $props();
</script>

{#if season === 'christmas'}
	<ChristmasLights />
{:else}
	<svg class="holiday-garland" width="100%" height="42" aria-hidden="true">
		<defs>
			<pattern id="holiday-garland-pattern" width="180" height="42" patternUnits="userSpaceOnUse">
				<path
					d="M0 2Q45 17 90 2Q135 17 180 2"
					fill="none"
					stroke="var(--festive-gold)"
					stroke-width="1.2"
				/>
				{#if season === 'tet'}
					<g stroke="var(--festive-gold)" stroke-width="1.3">
						<path d="M45 9v8m0 15v8m90-31v8m0 15v8" />
						<ellipse cx="45" cy="25" rx="12" ry="10" fill="var(--festive-red)" />
						<ellipse cx="135" cy="25" rx="12" ry="10" fill="var(--festive-red)" />
						<ellipse cx="45" cy="25" rx="5" ry="10" fill="none" />
						<ellipse cx="135" cy="25" rx="5" ry="10" fill="none" />
						<path d="M39 15h12m-12 20h12m78-20h12m-12 20h12" stroke-width="2.5" />
						<path d="M90 2v12" />
						<path d="m81 14 18 1-1 24-18-1Z" fill="var(--festive-red)" />
						<path d="m81 14 8 8 10-7" fill="none" />
						<path d="m89 26 4 4-4 4-4-4Z" fill="var(--festive-gold)" stroke="none" />
					</g>
				{:else}
					<path d="M45 10v7m90-7v7" stroke="var(--festive-gold)" stroke-width="1.2" />
					<path d="m45 17 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="var(--festive-gold)" />
					<path d="m135 17 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="var(--accent)" />
				{/if}
			</pattern>
		</defs>
		<rect width="100%" height="42" fill="url(#holiday-garland-pattern)" />
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
