<script lang="ts">
	import { page } from '$app/state';

	let notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} | chiraitori.dev</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page">
	<section aria-labelledby="error-title">
		<p class="error-code">{page.status}</p>
		<h1 id="error-title">{notFound ? 'Nothing here.' : 'Something broke.'}</h1>
		<p class="error-message">
			{notFound ? 'Wrong link, maybe?' : 'Try again in a bit.'}
		</p>
		<a href="/#home">
			<svg aria-hidden="true" viewBox="0 0 32 24" fill="none">
				<path d="M28 13C21 11 13 14 5 12M12 5L4 12l8 7" />
			</svg>
			<span>Back home</span>
		</a>
	</section>
</main>

<style>
	.error-page {
		display: grid;
		min-height: 100svh;
		align-items: center;
		padding: max(32px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right))
			max(48px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));
	}
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(100%, 560px);
		margin-inline: auto;
		text-align: center;
	}
	.error-code {
		margin: 0 0 24px;
		color: var(--accent);
		font-family: var(--font-hero);
		font-size: clamp(6rem, 18vw, 9rem);
		line-height: 1;
		letter-spacing: -0.06em;
	}
	h1 {
		margin: 0;
		color: var(--ink);
		font-family: var(--font-hero);
		font-size: clamp(1.8rem, 6vw, 2.5rem);
		line-height: 1.25;
	}
	.error-message {
		margin: 12px 0 32px;
		color: var(--ink-muted);
		font-size: 1rem;
		line-height: 1.6;
	}
	a {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		gap: 12px;
		color: var(--accent);
		font-size: 1rem;
		text-decoration: none;
	}
	a span {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 6px;
	}
	a:hover {
		color: var(--accent-hover);
	}
	svg {
		width: 32px;
		height: 24px;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
