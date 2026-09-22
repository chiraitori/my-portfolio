<script lang="ts">
	import { onMount } from 'svelte';
	import { getCountdown, getHolidayTarget } from '$lib/seasonal';

	let { season }: { season: 'new-year' | 'tet' } = $props();
	let target = $state<ReturnType<typeof getHolidayTarget>>(null);
	let now = $state(0);
	const remaining = $derived(target ? getCountdown(target.timestamp, now) : null);
	const units = $derived(
		remaining
			? [
					{ value: remaining.days, label: 'ngày' },
					{ value: remaining.hours, label: 'giờ' },
					{ value: remaining.minutes, label: 'phút' },
					{ value: remaining.seconds, label: 'giây' }
				]
			: []
	);
	const targetLabel = $derived(
		target
			? new Intl.DateTimeFormat('vi-VN', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					timeZone: 'Asia/Ho_Chi_Minh'
				}).format(target.timestamp)
			: ''
	);

	onMount(() => {
		now = Date.now();
		target = getHolidayTarget(season, new Date(now));
		let timer: number | undefined;
		const update = () => {
			now = Date.now();
			if (target && now >= target.timestamp && timer !== undefined) {
				window.clearInterval(timer);
				timer = undefined;
			}
		};
		const sync = () => {
			if (timer !== undefined) window.clearInterval(timer);
			timer = undefined;
			update();
			if (!document.hidden && target && now < target.timestamp)
				timer = window.setInterval(update, 1000);
		};
		sync();
		document.addEventListener('visibilitychange', sync);
		return () => {
			if (timer !== undefined) window.clearInterval(timer);
			document.removeEventListener('visibilitychange', sync);
		};
	});
</script>

<div class="holiday-countdown">
	{#if target && remaining}
		<div class="countdown-heading" aria-live="polite">
			{#if remaining.complete}
				<span aria-hidden="true">✧</span>
				{season === 'tet' ? 'Tết đã về' : 'Chào năm mới'}
				{target.year}!
			{:else}
				Cùng đón {season === 'tet' ? 'Tết' : 'năm mới'} {target.year}
			{/if}
		</div>
		{#if !remaining.complete}
			<div
				class="countdown-units"
				role="timer"
				aria-live="off"
				aria-label={`Đếm ngược đến ${season === 'tet' ? 'Tết' : 'năm mới'} ${target.year}`}
			>
				{#each units as unit (unit.label)}
					<div class="countdown-unit">
						<span class="number">{String(unit.value).padStart(2, '0')}</span><span
							class="unit-label">{unit.label}</span
						>
					</div>
				{/each}
			</div>
			<p class="countdown-date">00:00 · {targetLabel} · giờ Việt Nam</p>
		{:else}
			<p class="celebration">Chúc bạn một năm mới bình an, nhiều niềm vui!</p>
		{/if}
	{:else}
		<p class="countdown-date">Đang chuẩn bị đón giao thừa…</p>
	{/if}
</div>

<style>
	.holiday-countdown {
		min-height: 136px;
		text-align: center;
	}
	.countdown-heading {
		color: var(--festive-red);
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 12px;
	}
	.countdown-units {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
	.countdown-unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 62px;
		padding: 8px 4px;
		border: 1px solid var(--line);
		border-radius: 14px 10px 16px 9px;
		background: var(--surface);
		box-shadow: 2px 3px 0 var(--shadow);
	}
	.number {
		color: var(--ink);
		font-size: 27px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		line-height: 1.2;
	}
	.unit-label {
		font-size: 11px;
		color: var(--ink-muted);
		margin-top: 3px;
	}
	.countdown-date {
		margin: 10px 0 0;
		font-size: 11px;
		color: var(--ink-muted);
	}
	.celebration {
		margin: 16px auto;
		max-width: 280px;
		font-size: 14px;
		line-height: 1.8;
		color: var(--ink-muted);
	}
	@media (max-width: 639px) {
		.countdown-units {
			gap: 7px;
		}
		.countdown-unit {
			width: 52px;
		}
		.number {
			font-size: 23px;
		}
		.countdown-heading {
			font-size: 13px;
		}
	}
</style>
