<script lang="ts">
	import HeroIntro from '$lib/components/molecules/HeroIntro.svelte';
	import heroBanner from '$lib/assets/hero-banner.png';
	import ganyuBanner from '$lib/assets/ganyu-character.png';
</script>

<section class="hero-section">
	<div class="hero-banner">
		<div class="image-container">
			<img src={heroBanner} alt="Hero banner" class="hero-bg default-bg" />
			<img src={ganyuBanner} alt="Ganyu banner" class="hero-bg ganyu-bg" />
		</div>

		<!-- Text content -->
		<div class="hero-text">
			<HeroIntro />
		</div>
	</div>
</section>

<style>
	.hero-section {
		display: flex;
		flex-direction: column;
	}

	.hero-banner {
		position: relative;
		min-height: 600px;
		display: flex;
		align-items: center;
	}

	.image-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: -2rem; /* Covers the gap-8 on mobile */
		overflow: hidden;
		/* Use mask-image to fade the edges dynamically, so it works on any theme background! */
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			rgba(0, 0, 0, 0.3) 15%,
			rgba(0, 0, 0, 0.8) 35%,
			black 60%,
			black 85%,
			rgba(0, 0, 0, 0.4) 95%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			rgba(0, 0, 0, 0.3) 15%,
			rgba(0, 0, 0, 0.8) 35%,
			black 60%,
			black 85%,
			rgba(0, 0, 0, 0.4) 95%,
			transparent 100%
		);
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: right bottom;
		z-index: 0;
		pointer-events: none;
		user-select: none;
		transition: opacity 300ms ease;
	}

	/* Theme switching */
	.ganyu-bg {
		display: none;
	}
	:global(.ganyu-theme) .default-bg {
		display: none;
	}
	:global(.ganyu-theme) .ganyu-bg {
		display: block;
	}

	.hero-text {
		position: relative;
		z-index: 5;
		padding: 32px 0 32px 50px;
		width: 100%;
		max-width: 700px; /* Increased slightly to account for the new padding */
	}

	@media (max-width: 767px) {
		.hero-text {
			padding: 24px 16px;
		}
	}

	@media (min-width: 1024px) {
		.image-container {
			bottom: -3rem; /* Covers the lg:gap-12 on desktop */
		}
	}
</style>
