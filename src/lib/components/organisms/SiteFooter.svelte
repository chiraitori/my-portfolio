<script lang="ts">
	import { holidayThemes, type Season } from '$lib/seasonal';
	import { navigateSection } from '$lib/navigation';
	let { season = null }: { season?: Season | null } = $props();
	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="footer-main">
		<div class="footer-intro">
			<a
				class="footer-brand"
				href="#home"
				onclick={(event) => navigateSection(event, '#home')}
				aria-label="chiraitori.dev home">chiraitori.dev</a
			>
			<p>
				{season
					? holidayThemes[season].footer
					: 'Thanks for stopping by. See you around the internet.'}
			</p>
		</div>

		<div class="footer-actions">
			<a href="https://github.com/chiraitori" target="_blank" rel="noreferrer">
				<span>GitHub</span>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M8 16 16 8" />
					<path d="M10 8h6v6" />
				</svg>
			</a>

			<button type="button" onclick={(event) => navigateSection(event, '#home')}>
				<span>Back to top</span>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="m7 11 5-5 5 5" />
					<path d="M12 6v12" />
				</svg>
			</button>
		</div>
	</div>

	<div class="footer-meta">
		<span>&copy; {year} Chiraitori</span>
		<span>{season ? holidayThemes[season].credit : 'Made with SvelteKit and Love'}</span>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		width: calc(100% - 64px);
		max-width: 1256px;
		margin: 0 auto;
		padding: 32px 0 24px;
		border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
		color: inherit;
	}

	.site-footer::before {
		position: absolute;
		top: -2px;
		left: 0;
		width: min(150px, 36vw);
		height: 3px;
		background: var(--accent);
		content: '';
		transform: rotate(-0.5deg);
	}

	.footer-main {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
	}

	.footer-intro {
		display: grid;
		gap: 7px;
	}

	.footer-brand {
		width: fit-content;
		color: inherit;
		font-family: var(--font-nav);
		font-size: clamp(22px, 2.3vw, 30px);
		font-weight: 700;
		letter-spacing: 0.01em;
		line-height: 1.2;
		text-decoration: none;
	}

	.footer-intro p {
		margin: 0;
		color: var(--ink-muted);
		font-family: var(--font-sans);
		font-size: 14px;
	}

	.footer-actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.footer-actions a,
	.footer-actions button {
		display: inline-flex;
		min-height: 44px;
		padding: 0 14px;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		border-radius: 35px 20px 35px 20px / 20px 35px 20px 35px;
		background: transparent;
		color: inherit;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font: 700 14px/1 var(--font-nav);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			background-color 180ms ease,
			transform 180ms ease;
	}

	.footer-actions a:hover,
	.footer-actions button:hover {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 13%, transparent);
		transform: translateY(-2px);
	}

	.footer-actions a:focus-visible,
	.footer-actions button:focus-visible,
	.footer-brand:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.footer-actions svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}

	.footer-meta {
		display: flex;
		margin-top: 26px;
		padding-top: 16px;
		border-top: 1px dashed color-mix(in srgb, currentColor 15%, transparent);
		color: var(--ink-muted);
		justify-content: space-between;
		gap: 16px;
		font-family: var(--font-sans);
		font-size: 12px;
	}

	@media (max-width: 1023px) {
		.site-footer {
			padding: 20px 0 calc(96px + env(safe-area-inset-bottom, 0px));
		}
		.footer-main {
			display: none;
		}
		.footer-meta {
			margin-top: 0;
			padding-top: 0;
			border-top: 0;
			flex-wrap: wrap;
			gap: 8px 16px;
		}
	}

	@media (max-width: 640px) {
		.site-footer {
			width: calc(100% - 40px);
			margin: 0 auto;
			padding-top: 28px;
			padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
		}

		.footer-main {
			align-items: flex-start;
			flex-direction: column;
			gap: 22px;
		}

		.footer-actions {
			width: 100%;
		}

		.footer-actions a,
		.footer-actions button {
			flex: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.footer-actions a,
		.footer-actions button {
			transition: none;
		}
	}
</style>
