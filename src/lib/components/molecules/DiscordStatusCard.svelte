<script lang="ts">
	import StatusDot from '$lib/components/atoms/StatusDot.svelte';
	import type { PresenceActivityInfo, StatusInfo } from '$lib/types/portfolio';
	import { slide } from 'svelte/transition';

	let {
		status,
		activities
	}: {
		status: StatusInfo;
		activities: PresenceActivityInfo[];
	} = $props();

	let progress = $state(0);
	let spotifyActivity = $derived(activities.find((activity) => activity.kind === 'spotify'));

	$effect(() => {
		if (!spotifyActivity?.timestamps) {
			progress = 0;
			return;
		}

		let frameId: number;
		const updateProgress = () => {
			if (!spotifyActivity?.timestamps) return;
			const { start, end } = spotifyActivity.timestamps;
			const total = end - start;
			const current = Date.now() - start;
			progress = Math.min(Math.max(current / total, 0), 1);
			frameId = requestAnimationFrame(updateProgress);
		};

		frameId = requestAnimationFrame(updateProgress);

		return () => cancelAnimationFrame(frameId);
	});

	function getFallbackInitials(activity: PresenceActivityInfo) {
		if (activity.kind === 'code') return 'VS';
		return activity.title
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((word) => word[0]?.toUpperCase())
			.join('');
	}
</script>

<div
	class="theme-surface flex flex-col gap-4 rounded-3xl border-[1.5px] border-[#302b30]/15 dark:border-zinc-700/30 bg-white/40 dark:bg-zinc-900/30 p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
>
	<div class="flex items-center gap-2">
		<StatusDot {status} />
		<span class="font-sans text-sm font-semibold text-[#302b30]/70 dark:text-zinc-300/80"
			>I'm {status.text}</span
		>
	</div>

	<div class="flex flex-col gap-2.5 text-[13px] text-[#302b30]/60 dark:text-zinc-400/70">
		<div class="flex items-center gap-2">
			<svg
				class="h-4 w-4 fill-none stroke-current stroke-[1.8]"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
				/>
			</svg>
			<span>{status.location}</span>
		</div>
		<div class="flex items-center gap-2">
			<svg
				class="h-4 w-4 fill-none stroke-current stroke-[1.8]"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
				/>
			</svg>
			<span>{status.love}</span>
		</div>
	</div>

	<p class="text-sm text-[#302b30]/80 dark:text-zinc-200">{status.message}</p>

	{#if activities.length}
		<div
			transition:slide={{ duration: 300 }}
			class="mt-1 flex flex-col gap-3 border-t border-[#302b30]/10 pt-3 text-xs text-[#302b30]/80 dark:border-zinc-700/20 dark:text-zinc-200"
		>
			{#each activities as activity (activity.id)}
				<div class="flex min-w-0 items-center gap-3">
					<div class="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center">
						{#if activity.kind === 'spotify'}
							<svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
								<circle
									cx="50"
									cy="50"
									r="46"
									fill="none"
									class="stroke-[#302b30]/10 dark:stroke-zinc-700/30"
									stroke-width="6"
								/>
								<circle
									cx="50"
									cy="50"
									r="46"
									fill="none"
									class="stroke-[#1db954]"
									stroke-width="6"
									stroke-dasharray="289.03"
									stroke-dashoffset={289.03 - 289.03 * progress}
									stroke-linecap="round"
								/>
							</svg>
						{/if}

						{#if activity.imageUrl}
							<img
								src={activity.imageUrl}
								alt={activity.imageAlt}
								class={activity.kind === 'spotify'
									? 'h-[30px] w-[30px] rounded-full object-cover'
									: 'h-[34px] w-[34px] rounded-xl border border-[#302b30]/10 bg-white/60 object-cover dark:border-zinc-700/30 dark:bg-zinc-900/60'}
							/>
						{:else}
							<div
								class="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-[#302b30]/10 bg-[#302b30]/5 text-[10px] font-bold text-[#302b30]/70 dark:border-zinc-700/30 dark:bg-zinc-800/70 dark:text-zinc-200"
								aria-label={activity.imageAlt}
							>
								{getFallbackInitials(activity)}
							</div>
						{/if}
					</div>

					<div class="flex min-w-0 flex-col">
						<span
							class={activity.kind === 'spotify'
								? 'text-[9px] font-semibold tracking-wider text-[#1db954] uppercase'
								: 'text-[9px] font-semibold tracking-wider text-[#68b78d] uppercase'}
						>
							{activity.label}
						</span>

						{#if activity.href}
							<a
								href={activity.href}
								target="_blank"
								rel="noopener noreferrer"
								class="truncate text-xs font-semibold text-[#302b30] transition-colors hover:text-[#1db954] hover:underline dark:text-zinc-100 dark:hover:text-[#1db954]"
							>
								{activity.title}
							</a>
						{:else}
							<span class="truncate text-xs font-semibold text-[#302b30] dark:text-zinc-100">
								{activity.title}
							</span>
						{/if}

						{#if activity.subtitle}
							<span class="truncate text-[11px] text-[#302b30]/60 dark:text-zinc-400/80">
								{activity.subtitle}
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
</style>
