<script lang="ts">
	import { holidayThemes, type Season } from '$lib/seasonal';
	import HeroIntro from '$lib/components/molecules/HeroIntro.svelte';
	import heroBanner from '$lib/assets/hero-banner.webp';
	import ganyuBanner from '$lib/assets/ganyu-character.webp';
	import { onMount } from 'svelte';
	let {
		donationOpen,
		onOpenDonation,
		season = null
	}: {
		donationOpen: boolean;
		onOpenDonation: () => void;
		season?: Season | null;
	} = $props();
	let hero: HTMLElement;
	let paused = $state(false);
	onMount(() => {
		let visible = true;
		const update = () => (paused = !visible || document.hidden);
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			update();
		});
		observer.observe(hero);
		document.addEventListener('visibilitychange', update);
		update();
		return () => {
			observer.disconnect();
			document.removeEventListener('visibilitychange', update);
		};
	});
</script>

<section class="hero-section" bind:this={hero} class:motion-paused={paused}>
	<div
		class="hero-banner"
		style:--portrait-source={`url('${heroBanner}')`}
		style:--ganyu-source={`url('${ganyuBanner}')`}
	>
		<div class="hero-scene" aria-hidden="true">
			<div class="artwork-entry"><div class="scene-artwork"></div></div>
			<svg class="scene-sparkles" viewBox="0 0 1000 560" fill="currentColor">
				<path d="M450 105q0 9 9 9-9 0-9 9 0-9-9-9 9 0 9-9" />
				<path d="M810 70q0 7 7 7-7 0-7 7 0-7-7-7 7 0 7-7" />
				<path d="M880 230q0 10 10 10-10 0-10 10 0-10-10-10 10 0 10-10" />
				<path d="M370 390q0 7 7 7-7 0-7 7 0-7-7-7 7 0 7-7" />
			</svg>
		</div>
		<div class="hero-text"><HeroIntro {season} {donationOpen} {onOpenDonation} /></div>
		{#if season}
			<div class="holiday-corner" aria-hidden="true">
				<img src={holidayThemes[season].artwork} width="180" height="210" alt="" />
				<span>{holidayThemes[season].caption}</span>
			</div>
		{/if}
	</div>
</section>

<style>
	.hero-section {
		min-width: 0;
	}
	.holiday-corner {
		position: absolute;
		right: 8px;
		bottom: 18px;
		width: clamp(100px, 17%, 154px);
		text-align: center;
		pointer-events: none;
	}
	.holiday-corner img {
		width: 100%;
		height: auto;
	}
	.holiday-corner span {
		display: block;
		color: var(--festive-green);
		font-size: 12px;
		transform: rotate(-5deg);
	}
	@media (max-width: 767px) {
		.holiday-corner {
			display: none;
		}
	}
	.hero-banner {
		--art-source: var(--portrait-source);
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
	}
	.hero-scene {
		position: absolute;
		inset: 0 0 0 8%;
		z-index: -1;
		pointer-events: none;
		mask-image:
			linear-gradient(to right, transparent, #000 38%, #000 82%, transparent),
			linear-gradient(to bottom, transparent, #000 16%, #000 68%, transparent);
		mask-composite: intersect;
	}
	.scene-artwork {
		position: absolute;
		inset: 0;
		background-image: var(--art-source);
		background-size: cover;
		background-position: right center;
		transform-origin: 75% 65%;
		animation: artwork-breathe 14s ease-in-out infinite alternate;
	}
	.artwork-entry {
		position: absolute;
		inset: -6px;
		animation: character-enter 900ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
	}
	.scene-sparkles path {
		transform-box: fill-box;
		transform-origin: center;
		animation: shimmer 5s ease-in-out infinite alternate;
	}
	.scene-sparkles path:nth-child(2n) {
		animation-delay: -2s;
	}
	@keyframes artwork-breathe {
		from {
			transform: scale(1) translateY(0);
		}
		to {
			transform: scale(1.015) translateY(-3px);
		}
	}
	@keyframes shimmer {
		from {
			opacity: 0.15;
			transform: scale(0.65);
		}
		to {
			opacity: 0.8;
			transform: scale(1.05);
		}
	}
	.motion-paused .scene-artwork,
	.motion-paused .scene-sparkles path {
		animation-play-state: paused;
	}
	.hero-scene::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, var(--page), transparent 65%);
	}
	.scene-sparkles {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: #fff9ff;
		animation: sparkles-enter 1100ms ease-out 250ms both;
	}
	:global(html.dark) .scene-artwork {
		filter: brightness(0.65) saturate(0.8);
	}
	:global(html.dark) .hero-scene::after {
		background: linear-gradient(
			to right,
			var(--page),
			color-mix(in srgb, var(--page) 25%, transparent) 70%
		);
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
		.artwork-entry,
		.scene-sparkles path,
		.scene-artwork,
		.scene-sparkles,
		.hero-text {
			animation: none;
		}
	}
</style>
