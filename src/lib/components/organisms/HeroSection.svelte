<script lang="ts">
	import HeroIntro from '$lib/components/molecules/HeroIntro.svelte';
	import heroBanner from '$lib/assets/hero-banner.png';
	import ganyuBanner from '$lib/assets/ganyu-character.png';
	import background from '$lib/assets/hero-layers/pastel-background.png';
	import portraitMask from '$lib/assets/hero-layers/chiraitori-mask.png';
	import ganyuMask from '$lib/assets/hero-layers/ganyu-mask.png';
</script>

<section class="hero-section">
	<div
		class="hero-banner"
		style:--portrait-source={`url('${heroBanner}')`}
		style:--ganyu-source={`url('${ganyuBanner}')`}
		style:--portrait-mask={`url('${portraitMask}')`}
		style:--ganyu-mask={`url('${ganyuMask}')`}
	>
		<div class="hero-scene" aria-hidden="true">
			<img src={background} class="scene-background" alt="" decoding="async" />
			<div class="scene-character cutout"></div>
			<svg class="scene-sparkles" viewBox="0 0 1000 560" fill="currentColor">
				<path
					d="M450 105q0 9 9 9-9 0-9 9 0-9-9-9 9 0 9-9M810 70q0 7 7 7-7 0-7 7 0-7-7-7 7 0 7-7M880 230q0 10 10 10-10 0-10 10 0-10-10-10 10 0 10-10M370 390q0 7 7 7-7 0-7 7 0-7-7-7 7 0 7-7"
				/>
			</svg>
		</div>
		<div class="hero-text"><HeroIntro /></div>
	</div>
</section>

<style>
	.hero-section {
		min-width: 0;
	}
	.hero-banner {
		--art-source: var(--portrait-source);
		--art-mask: var(--portrait-mask);
		position: relative;
		isolation: isolate;
		overflow: hidden;
		min-height: 520px;
		container-type: inline-size;
		display: flex;
		align-items: center;
	}
	:global(html.ganyu-theme) .hero-banner {
		--art-source: var(--ganyu-source);
		--art-mask: var(--ganyu-mask);
	}
	.hero-scene {
		position: absolute;
		inset: 0 0 0 8%;
		z-index: -1;
		pointer-events: none;
		mask-image:
			linear-gradient(to right, transparent, #000 35%, #000 90%, transparent),
			linear-gradient(to bottom, transparent, #000 10%, #000 82%, transparent);
		mask-composite: intersect;
	}
	.scene-background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: background-enter 1300ms cubic-bezier(0.16, 1, 0.3, 1) 60ms both;
	}
	.cutout {
		position: absolute;
		inset: 0;
		background-image: var(--art-source);
		background-size: cover;
		background-position: right center;
		/* Luminance mattes keep the original artwork; all layers share its crop. */
		mask-image: var(--art-mask);
		mask-size: cover;
		mask-position: right center;
		mask-repeat: no-repeat;
		mask-mode: luminance;
	}
	/* Keep the entire silhouette together: slicing it creates seams during motion. */
	.scene-character {
		transform-origin: 75% 80%;
		animation: character-enter 900ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
	}
	.scene-sparkles {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: #fff9ff;
		animation: sparkles-enter 1100ms ease-out 250ms both;
	}
	:global(html.dark) .scene-background {
		opacity: 0.16;
	}
	:global(html.dark) .cutout {
		filter: brightness(0.85) saturate(0.85);
	}
	:global(html.dark) .scene-sparkles {
		opacity: 0.45;
	}
	.hero-text {
		position: relative;
		width: 100%;
		max-width: 700px;
		padding: 40px clamp(16px, 3vw, 40px);
		animation: intro-enter 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	@keyframes background-enter {
		from {
			transform: translate(12px, 60px) scale(1.04);
		}
		to {
			transform: none;
		}
	}
	@keyframes character-enter {
		from {
			transform: translate(50px, 12px) scale(1.04);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	@keyframes sparkles-enter {
		from {
			transform: translateY(30px) scale(0.97);
		}
		to {
			transform: none;
		}
	}
	@keyframes intro-enter {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 1023px) {
		.hero-banner {
			min-height: 0;
		}
		.hero-text {
			padding: 40px 8px 28px;
		}
		.hero-scene {
			left: 24%;
			opacity: 0.65;
		}
	}
	@media (max-width: 639px) {
		.hero-scene {
			display: none;
		}
		.hero-text {
			padding: 32px 4px 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scene-background,
		.scene-character,
		.scene-sparkles,
		.hero-text {
			animation: none;
		}
	}
</style>
