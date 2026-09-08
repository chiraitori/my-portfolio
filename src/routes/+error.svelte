<script lang="ts">
	import { onMount } from 'svelte';

	let { status = 404 }: { status?: number } = $props();
	onMount(() => {
		try {
			const isGanyu = localStorage.getItem('portfolio-theme') === 'ganyu';
			const isDark = localStorage.getItem('portfolio-dark-mode') === 'true';
			document.documentElement.classList.toggle('ganyu-theme', isGanyu);
			document.documentElement.classList.toggle('dark', isDark);
		} catch {
			// The page still works when storage is unavailable.
		}
	});
</script>

<svelte:head>
	<title>{status} | chiraitori.dev</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page">
	<div class="error-orbit" aria-hidden="true"></div>
	<section class="error-card theme-surface" aria-labelledby="error-title">
		<div class="error-code" aria-hidden="true">{status}</div>
		<h1 id="error-title">This page wandered off.</h1>
		<p>The address is missing or no longer exists. Let’s get you back to something that does.</p>
		<div class="error-actions">
			<a class="primary-action" href="/#home">Back home <span aria-hidden="true">↗</span></a>
			<button class="secondary-action" type="button" onclick={() => history.back()}
				>Go back <span aria-hidden="true">←</span></button
			>
		</div>
	</section>
</main>

<style>
	.error-page {
		position: relative;
		display: grid;
		min-height: 100dvh;
		place-items: center;
		overflow: hidden;
		padding: 24px;
		background:
			radial-gradient(
				circle at 72% 22%,
				color-mix(in srgb, var(--accent) 12%, transparent),
				transparent 32%
			),
			var(--page);
	}
	.error-card {
		position: relative;
		z-index: 1;
		width: min(100%, 560px);
		padding: clamp(28px, 6vw, 64px);
		border: 1.5px solid var(--line);
		border-radius: 35px 20px 35px 20px / 20px 35px 20px 35px;
		text-align: center;
		box-shadow: 8px 8px 0 color-mix(in srgb, var(--accent) 16%, transparent);
	}
	.error-code {
		margin-top: 24px;
		color: var(--accent);
		font-family: var(--font-hero);
		font-size: clamp(6rem, 24vw, 10rem);
		line-height: 0.9;
		letter-spacing: -0.08em;
	}
	h1 {
		margin: 22px 0 8px;
		color: var(--ink);
		font-family: var(--font-hero);
		font-size: clamp(1.6rem, 5vw, 2.4rem);
	}
	p {
		max-width: 34ch;
		margin: 0 auto;
		color: var(--ink-muted);
		font-size: 14px;
		line-height: 1.7;
	}
	.error-actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-top: 28px;
		flex-wrap: wrap;
	}
	.error-actions a,
	.error-actions button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 0 18px;
		border-radius: 999px;
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		font-family: inherit;
		cursor: pointer;
		transition:
			transform 180ms ease,
			background-color 180ms ease;
	}
	.error-actions a:hover,
	.error-actions button:hover {
		transform: translateY(-2px);
	}
	.primary-action {
		background: var(--accent);
		color: var(--on-accent);
	}
	.secondary-action {
		border: 1px solid var(--line);
		background: transparent;
		color: var(--ink);
	}
	.secondary-action:hover {
		background: var(--surface-hover);
	}
	.error-orbit {
		position: absolute;
		width: min(70vw, 520px);
		height: min(70vw, 520px);
		border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
		border-radius: 48% 52% 44% 56%;
		transform: rotate(-16deg);
	}
	@media (max-width: 480px) {
		.error-page {
			padding: 16px;
		}
		.error-card {
			padding: 28px 20px;
		}
		.error-actions a,
		.error-actions button {
			flex: 1 1 140px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.error-actions a,
		.error-actions button {
			transition: none;
		}
	}
</style>
