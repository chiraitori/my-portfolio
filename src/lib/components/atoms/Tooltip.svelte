<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		tip = '',
		active = false,
		children
	}: { tip?: string; active?: boolean; children: Snippet } = $props();

	let loaded = $state(false);
	onMount(() => (loaded = true));
</script>

<!-- preventing layout shifts by checking if page is fully loaded. if not, return original slot -->
{#if loaded && tip}
	<div class="tooltip-wrapper group inline-block relative cursor-default">
		<span
			class="tooltip absolute whitespace-nowrap opacity-0 invisible transition-all duration-200 left-1/2 top-0 -translate-x-1/2 -translate-y-[120%] px-2.5 py-1 rounded-lg bg-[#302b30] text-[#fcf7ef] text-sm font-medium z-50 group-hover:opacity-100 group-hover:visible group-hover:-translate-y-[140%] pointer-events-none"
			class:opacity-100={active}
			class:visible={active}
			class:-translate-y-[140%]={active}
		>
			{tip}
			<!-- Arrow -->
			<span
				class="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#302b30]"
			></span>
		</span>
		<span class="tooltip-slot inline-block">
			{@render children()}
		</span>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	/* Ganyu theme overrides for Tooltip */
	:global(html.ganyu-theme) .tooltip {
		background-color: #4b6790;
		color: #edf7fc;
	}
	:global(html.ganyu-theme) .tooltip span {
		border-top-color: #4b6790;
	}
</style>
