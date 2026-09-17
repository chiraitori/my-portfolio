<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let secondsLeft = $state(15);

	onMount(() => {
		if (data.status !== 'PAID') return;

		const timer = window.setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft === 0) {
				window.clearInterval(timer);
				window.location.replace('/#home');
			}
		}, 1000);

		return () => window.clearInterval(timer);
	});

	const messages = {
		PAID: {
			label: 'Đã nhận được khoản ủng hộ',
			title: 'Cảm ơn bạn nhiều nhé!',
			body: 'Cảm ơn bạn đã mời mình một cốc. Có thêm động lực để làm tiếp những thứ mình thích rồi.',
			note: 'Hẹn gặp bạn ở những project tiếp theo.'
		},
		CANCELLED: {
			label: 'Thanh toán đã hủy',
			title: 'Đã hủy thanh toán',
			body: 'Không sao cả, cảm ơn bạn đã ghé qua. Bạn vẫn có thể quay lại xem những thứ mình đang làm nhé.',
			note: ''
		},
		PENDING: {
			label: 'Đang chờ PayOS xác nhận',
			title: 'Chờ thêm một chút nhé',
			body: 'Khoản ủng hộ chưa được xác nhận. Nếu đã chuyển khoản, bạn có thể kiểm tra lại sau một chút.',
			note: 'Bạn không cần chuyển thêm lần nữa.'
		},
		UNKNOWN: {
			label: 'Chưa xác nhận được trạng thái',
			title: 'Chưa kiểm tra được',
			body: 'Hiện mình chưa lấy được trạng thái từ PayOS. Bạn có thể bấm kiểm tra lại bên dưới.',
			note: 'Nếu đã chuyển tiền, hãy kiểm tra ứng dụng ngân hàng trước khi thử thanh toán lại.'
		}
	} as const;
	let message = $derived(messages[data.status]);
</script>

<svelte:head>
	<title>{message.title} · Chiraitori</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="result-page">
	<section class="result-content" aria-labelledby="result-title">
		<svg class="cup-drawing" viewBox="0 0 180 150" fill="none" aria-hidden="true">
			<ellipse class="cup-shadow" cx="87" cy="131" rx="55" ry="7" />
			<path class="cup-fill" d="M41 61c21-5 58-5 78 0l-6 40c-2 16-13 24-33 23-19-1-29-9-32-25Z" />
			<g class="cup-lines">
				<path
					d="M119 70c29-9 37 23 12 30l-17 3M40 60c23-5 57-5 80 0M42 62l6 37c3 17 13 25 32 25 20 1 31-8 34-25l5-37M34 129c25 10 72 10 102-1"
				/>
				<path
					class="steam"
					d="M65 43c-12-13 9-16 0-29M87 41c-12-14 9-17 1-30M109 45c-10-10 6-15 2-24"
				/>
				{#if data.status === 'PAID'}
					<path class="cup-heart" d="M81 82c-13-13-26 5 1 20 27-18 12-32-1-20Z" />
					<path
						class="spark"
						d="m143 37 2 7 7 2-7 2-2 7-2-7-7-2 7-2ZM29 79l1-5 5-1-5-1-1-5-1 5-5 1 5 1Z"
					/>
				{:else}
					<path d="M69 87h1m23 0h1M75 100c4 2 9 2 13 0" />
				{/if}
			</g>
		</svg>
		<div class="result-copy" role="status" aria-live="polite">
			<p class="status-label">
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					{#if data.status === 'PAID'}
						<path d="m4 10 4 4 8-9" />
					{:else if data.status === 'PENDING'}
						<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
					{:else if data.status === 'CANCELLED'}
						<path d="m6 6 8 8M14 6l-8 8" />
					{:else}
						<circle cx="10" cy="10" r="7" /><path d="M10 6v5m0 3h.01" />
					{/if}
				</svg>
				{message.label}
			</p>
			<h1 id="result-title">{message.title}</h1>
			<p class="message">{message.body}</p>
			{#if message.note}<p class="note">{message.note}</p>{/if}
		</div>
		{#if data.status === 'PAID'}<p class="signature">— Chiraitori</p>{/if}
		<div class="actions">
			<a href="/#home">
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
					><path d="M20 12H4m7-7-7 7 7 7" /></svg
				>
				Về trang chủ
			</a>
			{#if data.status === 'PENDING' || data.status === 'UNKNOWN'}
				<button class="secondary" type="button" onclick={() => window.location.reload()}>
					Kiểm tra lại
				</button>
			{/if}
		</div>
		{#if data.status === 'PAID'}
			<p class="redirect-note">Tự động về trang chủ sau {secondsLeft} giây.</p>
		{/if}
	</section>
</main>

<style>
	.result-page {
		display: grid;
		min-height: 100svh;
		place-items: center;
		padding: max(32px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right))
			max(32px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));
		background: var(--page);
	}
	.result-content {
		width: min(100%, 560px);
		text-align: center;
		color: var(--ink);
		animation: arrive 280ms ease-out both;
	}
	.cup-drawing {
		display: block;
		width: clamp(128px, 24vw, 168px);
		height: auto;
		margin: 0 auto 24px;
	}
	.cup-shadow {
		fill: var(--accent-soft);
	}
	.cup-fill {
		fill: var(--surface);
	}
	.cup-lines {
		stroke: var(--ink);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.steam {
		stroke: var(--ink-muted);
		opacity: 0.55;
	}
	.cup-heart {
		fill: var(--accent-soft);
		stroke: var(--accent);
	}
	.spark {
		stroke: var(--accent);
		stroke-width: 1.8;
	}
	.status-label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		margin: 0 0 16px;
		color: var(--accent);
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.6;
	}
	.status-label svg,
	.actions svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	h1 {
		margin: 0;
		font-family: var(--font-sans);
		font-size: clamp(1.6rem, 4.8vw, 2.2rem);
		font-weight: 600;
		line-height: 1.45;
		text-wrap: balance;
	}
	.message {
		max-width: 420px;
		margin: 18px auto 0;
		color: var(--ink-muted);
		font-size: 0.95rem;
		line-height: 1.85;
		text-wrap: pretty;
	}
	.note {
		max-width: 420px;
		margin: 12px auto 0;
		color: var(--ink-muted);
		font-size: 0.8rem;
		line-height: 1.8;
	}
	.signature {
		margin: 20px 0 0;
		color: var(--accent);
		font-size: 0.95rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-top: 32px;
	}
	.redirect-note {
		margin: 16px 0 0;
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.6;
	}
	.actions a,
	.actions button {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px 20px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--ink);
		text-decoration: none;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			box-shadow 180ms ease,
			border-color 180ms ease;
	}
	.actions .secondary {
		background: transparent;
	}
	.actions a:hover,
	.actions button:hover {
		border-color: var(--accent);
		box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 18%, transparent);
	}
	.actions a:focus-visible,
	.actions button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.result-content {
			animation: none;
		}
		.actions a,
		.actions button {
			transition: none;
		}
	}
</style>
