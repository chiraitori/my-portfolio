<script lang="ts">
	const year = new Date().getFullYear();

	function scrollToTop() {
		document.getElementById('home')?.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
			block: 'start'
		});
	}
</script>

<footer class="site-footer">
	<div class="footer-main">
		<div class="footer-intro">
			<a class="footer-brand" href="#home" aria-label="chiraitori.dev home">chiraitori.dev</a>
			<p>Thanks for stopping by. See you around the internet.</p>
		</div>

		<div class="footer-actions">
			<a href="https://github.com/chiraitori" target="_blank" rel="noreferrer">
				<span>GitHub</span>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M8 16 16 8" />
					<path d="M10 8h6v6" />
				</svg>
			</a>

			<button type="button" onclick={scrollToTop}>
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
		<span>Made with SvelteKit and Love</span>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		margin: 0 30px;
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
		background: #d89aaa;
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
		color: color-mix(in srgb, currentColor 68%, transparent);
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
		border-color: #d89aaa;
		background: color-mix(in srgb, #d89aaa 13%, transparent);
		transform: translateY(-2px);
	}

	.footer-actions a:focus-visible,
	.footer-actions button:focus-visible,
	.footer-brand:focus-visible {
		outline: 2px solid #c9788a;
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
		color: color-mix(in srgb, currentColor 55%, transparent);
		justify-content: space-between;
		gap: 16px;
		font-family: var(--font-sans);
		font-size: 12px;
	}

	@media (max-width: 640px) {
		.site-footer {
			margin: 0 20px;
			padding-top: 28px;
			padding-bottom: 96px;
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

	:global(html.ganyu-theme) .site-footer::before {
		background: #759dca;
	}

	:global(html.ganyu-theme) .footer-actions a:hover,
	:global(html.ganyu-theme) .footer-actions button:hover {
		border-color: #759dca;
		background: color-mix(in srgb, #759dca 13%, transparent);
	}

	:global(html.ganyu-theme) .footer-actions a:focus-visible,
	:global(html.ganyu-theme) .footer-actions button:focus-visible,
	:global(html.ganyu-theme) .footer-brand:focus-visible {
		outline: 2px solid #6398db;
	}

	:global(html.dark) .site-footer::before {
		background: #d89aaa; /* keep the pink color in normal dark mode */
	}

	:global(html.dark.ganyu-theme) .site-footer::before {
		background: #6398db;
	}
</style>
