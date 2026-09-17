<script lang="ts">
	let { label, onclick }: { label: string; onclick: () => void } = $props();
</script>

<button class="close-control" type="button" aria-label={label} {onclick}>
	<span class="close-circle" aria-hidden="true">
		<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7">
			<path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" stroke-linecap="round" />
		</svg>
	</span>
</button>

<style>
	.close-control {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 auto;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.close-circle {
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: color-mix(in srgb, var(--surface) 70%, var(--accent-soft));
		transition: box-shadow 180ms ease;
	}
	.close-circle svg {
		width: 18px;
		height: 18px;
	}
	@media (hover: hover) and (pointer: fine) {
		.close-control:hover .close-circle {
			box-shadow: 0 0 16px 5px color-mix(in srgb, var(--nav-bleed) 80%, transparent);
		}
	}
	.close-control:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.close-control:focus-visible .close-circle {
		box-shadow: 0 0 16px 5px color-mix(in srgb, var(--nav-bleed) 80%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		.close-circle {
			transition: none;
		}
	}
</style>
