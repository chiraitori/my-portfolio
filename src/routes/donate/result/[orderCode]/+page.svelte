<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const messages = {
		PAID: {
			title: 'Cảm ơn bạn nhiều!',
			body: 'PayOS đã xác nhận khoản ủng hộ. Mình thật sự trân trọng điều này.'
		},
		CANCELLED: {
			title: 'Đã hủy thanh toán',
			body: 'Không sao cả. Cảm ơn bạn đã ghé qua nhé.'
		},
		PENDING: {
			title: 'Đang chờ xác nhận',
			body: 'PayOS chưa xác nhận khoản chuyển khoản. Bạn có thể kiểm tra lại sau một chút.'
		},
		UNKNOWN: {
			title: 'Chưa kiểm tra được thanh toán',
			body: 'Mình chưa thể xác nhận trạng thái từ PayOS. Hãy kiểm tra trong ứng dụng ngân hàng trước khi thử lại.'
		}
	} as const;
	let message = $derived(messages[data.status]);
</script>

<svelte:head><title>Ủng hộ Chiraitori</title></svelte:head>

<main class="result-page">
	<section class="result-card theme-surface" aria-live="polite">
		<p class="eyebrow">PayOS · Donate</p>
		<h1>{message.title}</h1>
		<p>{message.body}</p>
		<div class="actions">
			<a href="/#home">Về trang chủ</a>
			{#if data.status === 'PENDING' || data.status === 'UNKNOWN'}
				<button class="secondary" type="button" onclick={() => window.location.reload()}>
					Kiểm tra lại
				</button>
			{/if}
		</div>
	</section>
</main>

<style>
	.result-page {
		display: grid;
		min-height: 100dvh;
		place-items: center;
		padding: 24px;
		background: var(--page);
	}
	.result-card {
		width: min(100%, 520px);
		padding: clamp(24px, 5vw, 40px);
		border: 1.5px solid var(--line);
		border-radius: 28px 22px 26px 24px;
		background: var(--surface);
		box-shadow: 5px 6px 0 var(--line);
		color: var(--ink);
	}
	.eyebrow {
		margin: 0 0 10px;
		color: var(--accent);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	h1 {
		margin: 0;
		font-family: var(--font-hero);
		font-size: clamp(1.8rem, 5vw, 2.7rem);
		font-weight: 400;
	}
	.result-card > p:not(.eyebrow) {
		margin: 14px 0 0;
		color: var(--ink-muted);
		line-height: 1.65;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.actions a,
	.actions button {
		padding: 11px 17px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--ink);
		font-weight: 700;
		text-decoration: none;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.actions .secondary {
		background: var(--surface);
	}
	.actions a:focus-visible,
	.actions button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
