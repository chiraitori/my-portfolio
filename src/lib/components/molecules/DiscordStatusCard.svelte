<script lang="ts">
	import ActivityImage from '$lib/components/atoms/ActivityImage.svelte';
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
			progress =
				Number.isFinite(total) && total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;
			frameId = requestAnimationFrame(updateProgress);
		};

		frameId = requestAnimationFrame(updateProgress);

		return () => cancelAnimationFrame(frameId);
	});

	function getFallbackInitials(activity: PresenceActivityInfo) {
		if (activity.kind === 'crunchyroll') return 'CR';
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
	class="presence-card theme-surface flex flex-col gap-4 rounded-3xl border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
>
	<div class="flex items-center gap-2">
		<StatusDot {status} />
		<span class="font-sans text-sm font-semibold text-[var(--ink-muted)]" aria-live="polite"
			>{status.text === 'Loading status…' || status.text === 'Status unavailable'
				? status.text
				: `I'm ${status.text}`}</span
		>
	</div>

	<div class="presence-details flex flex-col gap-2.5 text-[13px] text-[var(--ink-muted)]">
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

	<p class="presence-message text-sm text-[var(--ink-muted)]">{status.message}</p>

	{#if activities.length}
		<div
			transition:slide={{ duration: 300 }}
			class="presence-activity mt-1 flex flex-col gap-3 border-t border-[var(--line)] pt-3 text-xs text-[var(--ink-muted)]"
		>
			{#each activities as activity (activity.id)}
				<div class="flex min-w-0 items-center gap-3">
					<div
						class="relative flex w-[38px] shrink-0 items-center justify-center"
						class:h-[38px]={activity.kind !== 'crunchyroll'}
					>
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

						{#key `${activity.imageUrl}-${activity.fallbackImageUrl}`}
							<ActivityImage
								src={activity.imageUrl}
								fallbackSrc={activity.fallbackImageUrl}
								alt={activity.imageAlt}
								initials={getFallbackInitials(activity)}
								spotify={activity.kind === 'spotify'}
								poster={activity.kind === 'crunchyroll'}
							/>
						{/key}
					</div>

					<div class="flex min-w-0 flex-col">
						<span
							class={activity.kind === 'spotify'
								? 'text-[9px] font-semibold tracking-wider text-[#1db954] uppercase'
								: activity.kind === 'crunchyroll'
									? 'text-[9px] font-semibold tracking-wider text-[var(--accent)] uppercase'
									: 'text-[9px] font-semibold tracking-wider text-[#68b78d] uppercase'}
						>
							{activity.label}
						</span>

						{#if activity.href}
							<a
								href={activity.href}
								target="_blank"
								rel="noopener noreferrer"
								class="truncate text-xs font-semibold text-[var(--ink)] transition-colors hover:text-[#1db954] hover:underline dark:hover:text-[#1db954]"
							>
								{activity.title}
							</a>
						{:else}
							<span
								class={activity.kind === 'crunchyroll'
									? 'text-xs font-semibold break-words text-[var(--ink)]'
									: 'truncate text-xs font-semibold text-[var(--ink)]'}
							>
								{activity.title}
							</span>
						{/if}

						{#if activity.episode}
							<span class="text-[11px] font-semibold text-[var(--accent)]">{activity.episode}</span>
						{/if}
						{#if activity.subtitle}
							<span
								class={activity.kind === 'crunchyroll'
									? 'text-[11px] break-words whitespace-normal text-[var(--ink-muted)]'
									: 'truncate text-[11px] text-[var(--ink-muted)]'}
							>
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
	@media (max-width: 1023px) {
		.presence-card {
			padding: 14px 18px;
			gap: 10px;
		}
		.presence-details,
		.presence-message {
			display: none;
		}
		.presence-activity {
			margin-top: 0;
			padding-top: 10px;
		}
	}
	@media (min-width: 640px) and (max-width: 1023px) {
		.presence-card {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
		}
		.presence-activity {
			min-width: 0;
			max-width: 65%;
			border-top: 0;
			border-left: 1px solid var(--line);
			padding: 0 0 0 20px;
		}
	}
</style>
