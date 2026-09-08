<script lang="ts">
	import Sparkline from '$lib/components/atoms/Sparkline.svelte';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	interface ViewerStats {
		online: number;
		onPage: number;
		allTime: number;
		pageViews: number;
		siteHistory: number[];
		pageHistory: number[];
	}

	const HEARTBEAT_INTERVAL = 60_000;
	const VISITOR_STORAGE_KEY = 'portfolio:visitor-id';

	let stats = $state<ViewerStats | null>(null);

	const animatedOnline = new Tween(0, { duration: 1500, easing: cubicOut });
	const animatedOnPage = new Tween(0, { duration: 1500, easing: cubicOut });
	const animatedAllTime = new Tween(0, { duration: 1500, easing: cubicOut });
	const animatedPageViews = new Tween(0, { duration: 1500, easing: cubicOut });

	$effect(() => {
		if (stats) {
			animatedOnline.target = stats.online;
			animatedOnPage.target = stats.onPage;
			animatedAllTime.target = stats.allTime;
			animatedPageViews.target = stats.pageViews;
		}
	});

	const formatCount = (value: number | undefined) => {
		if (value === undefined || (value === 0 && !stats)) return '—';
		const rounded = Math.round(value);
		if (rounded < 1000) return rounded.toLocaleString('en-US');

		return Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 1
		}).format(rounded);
	};

	onMount(() => {
		const path = window.location.pathname;
		const pageViewKey = `portfolio:viewed:${path}`;
		let visitorId: string | null = null;
		let shouldRecordView = true;
		try {
			visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
			shouldRecordView = window.sessionStorage.getItem(pageViewKey) !== '1';
		} catch {
			/* Continue without persistent storage. */
		}
		let heartbeatTimer: number | undefined;

		if (!visitorId) {
			visitorId = crypto.randomUUID();
			try {
				window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
			} catch {
				/* Storage is optional. */
			}
		}

		const updateStats = async () => {
			if (document.visibilityState !== 'visible') return;

			try {
				const response = await fetch('/api/viewers', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						visitorId,
						path,
						recordView: shouldRecordView
					})
				});

				if (!response.ok) throw new Error('Viewer API unavailable');

				stats = await response.json();

				if (shouldRecordView) {
					try {
						window.sessionStorage.setItem(pageViewKey, '1');
					} catch {
						/* Storage is optional. */
					}
					shouldRecordView = false;
				}
			} catch {
				// Analytics should never interfere with the rest of the portfolio.
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') void updateStats();
		};

		void updateStats();
		heartbeatTimer = window.setInterval(updateStats, HEARTBEAT_INTERVAL);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			window.clearInterval(heartbeatTimer);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<div
	class="theme-surface flex flex-col gap-5 rounded-3xl border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
>
	<div class="flex items-center gap-2">
		<span
			class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[var(--accent)]"
			aria-hidden="true"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
		</span>
		<span class="font-sans text-sm font-semibold text-[var(--ink)]">Viewers</span>
	</div>

	<div class="grid grid-cols-2 gap-4 border-b border-[var(--line)] pb-4">
		<div>
			<div class="text-[10px] font-medium tracking-wider text-[var(--ink-muted)] uppercase">
				Right now
			</div>
			<div class="mt-0.5 text-3xl font-bold text-[var(--ink)]">
				{formatCount(animatedOnline.current)}
			</div>
			<div class="text-[10px] text-[var(--ink-muted)]">on site</div>
		</div>
		<div>
			<div class="text-[10px] font-medium tracking-wider text-[var(--ink-muted)] uppercase">
				This page
			</div>
			<div class="mt-0.5 text-3xl font-bold text-[var(--ink)]">
				{formatCount(animatedOnPage.current)}
			</div>
			<div class="text-[10px] text-[var(--ink-muted)]">currently</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-[10px] font-medium tracking-wider text-[var(--ink-muted)] uppercase">
					<span class="mr-1 font-bold text-[var(--accent)]">✦</span>All time
				</div>
				<div class="mt-0.5 text-xl font-bold text-[var(--ink)]">
					{formatCount(animatedAllTime.current)}
				</div>
				<div class="text-[10px] text-[var(--ink-muted)]">total</div>
			</div>
			<Sparkline
				values={stats?.siteHistory ?? Array(14).fill(0)}
				color="var(--accent)"
				gradientId="chart-green"
			/>
		</div>

		<div class="flex items-center justify-between">
			<div>
				<div class="text-xl font-bold text-[var(--ink)]">
					{formatCount(animatedPageViews.current)}
				</div>
				<div class="text-[10px] text-[var(--ink-muted)]">this page</div>
			</div>
			<Sparkline
				values={stats?.pageHistory ?? Array(14).fill(0)}
				color="var(--ink-muted)"
				gradientId="chart-purple"
			/>
		</div>
	</div>
</div>
