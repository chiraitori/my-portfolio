<script lang="ts">
	import Sparkline from '$lib/components/atoms/Sparkline.svelte';
	import { onMount } from 'svelte';

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

	const formatCount = (value: number | undefined) => {
		if (value === undefined) return '—';
		if (value < 1000) return value.toLocaleString('en-US');

		return Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 1
		}).format(value);
	};

	onMount(() => {
		const path = window.location.pathname;
		const pageViewKey = `portfolio:viewed:${path}`;
		let visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
		let shouldRecordView = window.sessionStorage.getItem(pageViewKey) !== '1';
		let heartbeatTimer: number | undefined;

		if (!visitorId) {
			visitorId = crypto.randomUUID();
			window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
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
					window.sessionStorage.setItem(pageViewKey, '1');
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
	class="theme-surface flex flex-col gap-5 rounded-3xl border-[1.5px] border-[#302b30]/15 dark:border-zinc-700/30 bg-white/40 dark:bg-zinc-900/30 p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
>
	<div class="flex items-center gap-2">
		<span
			class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#a15f70] dark:border-[#e8a7b5]"
			aria-hidden="true"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-[#a15f70] dark:bg-[#e8a7b5]"></span>
		</span>
		<span class="font-sans text-sm font-semibold text-[#302b30] dark:text-zinc-100">Viewers</span>
	</div>

	<div class="grid grid-cols-2 gap-4 border-b border-[#302b30]/5 dark:border-zinc-700/20 pb-4">
		<div>
			<div class="text-[10px] font-medium tracking-wider text-[#302b30]/50 dark:text-zinc-400/60 uppercase">
				Right now
			</div>
			<div class="mt-0.5 text-3xl font-bold text-[#302b30] dark:text-zinc-100">{formatCount(stats?.online)}</div>
			<div class="text-[10px] text-[#302b30]/40 dark:text-zinc-400/50">on site</div>
		</div>
		<div>
			<div class="text-[10px] font-medium tracking-wider text-[#302b30]/50 dark:text-zinc-400/60 uppercase">
				This page
			</div>
			<div class="mt-0.5 text-3xl font-bold text-[#302b30] dark:text-zinc-100">{formatCount(stats?.onPage)}</div>
			<div class="text-[10px] text-[#302b30]/40 dark:text-zinc-400/50">currently</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-[10px] font-medium tracking-wider text-[#302b30]/50 dark:text-zinc-400/60 uppercase">
					<span class="mr-1 font-bold text-[#8ac9a6]">✦</span>All time
				</div>
				<div class="mt-0.5 text-xl font-bold text-[#302b30] dark:text-zinc-100">
					{formatCount(stats?.allTime)}
				</div>
				<div class="text-[10px] text-[#302b30]/40 dark:text-zinc-400/50">total</div>
			</div>
			<Sparkline
				values={stats?.siteHistory ?? Array(14).fill(0)}
				color="#68b78d"
				gradientId="chart-green"
			/>
		</div>

		<div class="flex items-center justify-between">
			<div>
				<div class="text-xl font-bold text-[#302b30] dark:text-zinc-100">{formatCount(stats?.pageViews)}</div>
				<div class="text-[10px] text-[#302b30]/40 dark:text-zinc-400/50">this page</div>
			</div>
			<Sparkline
				values={stats?.pageHistory ?? Array(14).fill(0)}
				color="#a27eb0"
				gradientId="chart-purple"
			/>
		</div>
	</div>
</div>
