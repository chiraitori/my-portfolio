<script lang="ts">
	import { onMount } from 'svelte';
	import { holidayThemes, type Season } from '$lib/seasonal';
	import TetBranch from '$lib/components/atoms/TetBranch.svelte';
	import ChristmasSnowCanvas from '$lib/components/atoms/ChristmasSnowCanvas.svelte';
	import HolidayCountdown from './HolidayCountdown.svelte';
	let { season }: { season: Season } = $props();
	const theme = $derived(holidayThemes[season]);

	let effectsEnabled = $state(true);
	let reducedMotion = $state(false);
	let pageHidden = $state(false);
	// Deterministic positions keep server and client markup identical.
	const particles = Array.from({ length: 28 }, (_, i) => ({
		x: (i * 37 + 11) % 100,
		size: 2 + (i % 4),
		duration: 14 + (i % 7) * 2,
		delay: -((i * 7) % 29),
		drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 9)
	}));

	onMount(() => {
		try {
			effectsEnabled = localStorage.getItem(theme.storageKey) !== 'off';
		} catch {
			/* Effects still work when storage is unavailable. */
		}
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const syncMotion = () => (reducedMotion = preference.matches);
		const syncVisibility = () => (pageHidden = document.hidden);
		syncMotion();
		syncVisibility();
		preference.addEventListener('change', syncMotion);
		document.addEventListener('visibilitychange', syncVisibility);
		return () => {
			preference.removeEventListener('change', syncMotion);
			document.removeEventListener('visibilitychange', syncVisibility);
		};
	});

	function toggleEffects() {
		effectsEnabled = !effectsEnabled;
		try {
			localStorage.setItem(theme.storageKey, effectsEnabled ? 'on' : 'off');
		} catch {
			/* Keep the in-memory preference when storage is unavailable. */
		}
	}
</script>

<div class="season-greeting">
	<p>
		<svg viewBox="0 0 44 36" fill="none" aria-hidden="true">
			{#if season === 'christmas'}
				<path
					d="M22 23C7 26 5 15 5 9c8 0 16 2 17 14Zm0 0C21 11 29 5 38 5c0 10-5 20-16 18Z"
					fill="var(--festive-green)"
					fill-opacity=".18"
				/>
				<path
					d="m10 14 13 12M32 11 22 25M22 23C7 26 5 15 5 9c8 0 16 2 17 14Zm0 0C21 11 29 5 38 5c0 10-5 20-16 18Z"
					stroke="var(--festive-green)"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
				<g fill="var(--festive-red)"
					><circle cx="18" cy="26" r="4" /><circle cx="26" cy="25" r="4" /><circle
						cx="23"
						cy="31"
						r="4"
					/></g
				>
			{:else if season === 'new-year'}
				<path
					d="m22 3 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z"
					fill="var(--festive-gold)"
					fill-opacity=".25"
					stroke="var(--festive-gold)"
					stroke-width="1.5"
					stroke-linejoin="round"
				/>
			{:else}
				<defs>
					<linearGradient id="greeting-mai-petal" x1="0" y1="1" x2="0" y2="0">
						<stop offset="0" stop-color="#f0a81e" />
						<stop offset=".5" stop-color="#fbcf33" />
						<stop offset="1" stop-color="#fff0a6" />
					</linearGradient>
				</defs>
				<!-- Bronze loc leaf and green leaf tucked behind the bloom -->
				<path d="M20 29C12 31 7 28 5 22 13 21 18 24 20 29Z" fill="#b8613f" />
				<path d="M7 24Q13 25 19 28" stroke="#8a3f27" stroke-width=".6" />
				<path d="M24 29C32 32 38 29 40 23 32 22 26 24 24 29Z" fill="#8fb06a" />
				<path d="M38 25Q31 26 25 28" stroke="#648446" stroke-width=".6" />
				<g transform="translate(22 18) scale(.92)">
					<g fill="#6f9a4a">
						{#each [36, 108, 180, 252, 324] as r (r)}
							<path d="M0 0-2.6-6.5 0-8.4 2.6-6.5Z" transform={`rotate(${r})`} />
						{/each}
					</g>
					<g fill="url(#greeting-mai-petal)" stroke="#d39a1c" stroke-width=".6">
						{#each [0, 72, 144, 216, 288] as r (r)}
							<path
								d="M0-1.5C-5.4-4.5-7.6-11.6-4.4-15.2C-2.2-17.4 2.2-17.4 4.4-15.2C7.6-11.6 5.4-4.5 0-1.5Z"
								transform={`rotate(${r})`}
							/>
						{/each}
					</g>
					<circle r="7.2" stroke="#e8a52a" stroke-width=".5" />
					<circle r="7.6" stroke="#b4501f" stroke-width="1.6" stroke-dasharray="1.1 1.9" />
					<circle r="2.2" fill="#7ea24a" />
				</g>
			{/if}
		</svg>
		<span>{theme.greeting}<span class="greeting-extra">{' '}{theme.extra}</span>~</span>
	</p>
	<button
		type="button"
		class="effect-toggle"
		aria-label={theme.effectLabel}
		aria-pressed={effectsEnabled && !reducedMotion}
		disabled={reducedMotion}
		title={reducedMotion
			? `${theme.effectLabel} is paused to respect your reduced motion preference`
			: `Turn ${theme.effectLabel.toLowerCase()} on or off`}
		onclick={toggleEffects}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			aria-hidden="true"
		>
			{#if season === 'christmas'}
				<path
					d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3.5 10.5l4-1-1-4M17.5 18.5l-1-4 4-1M6.5 18.5l1-4-4-1M20.5 10.5l-4-1 1-4"
				/>
			{:else}
				<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
			{/if}
		</svg>
		<span
			>{theme.effect}
			<span class="effect-state">{reducedMotion ? 'paused' : effectsEnabled ? 'on' : 'off'}</span
			></span
		>
	</button>
</div>

{#if season === 'tet'}
	<div class="tet-wishes">
		<div class="blossom-branch peach-branch"><TetBranch blossom="peach" /></div>
		<div class="spring-wish">
			<span class="spring-kicker">Đào hồng · Mai vàng</span>
			<p>Một năm thật an yên</p>
			<span class="spring-detail">Đủ đầy niềm vui, đong đầy yêu thương</span>
			<div class="tet-countdown"><HolidayCountdown season="tet" /></div>
		</div>
		<div class="blossom-branch apricot-branch"><TetBranch blossom="apricot" /></div>
	</div>
{:else if season === 'new-year'}
	<div class="new-year-countdown"><HolidayCountdown season="new-year" /></div>
{/if}

{#if effectsEnabled && !reducedMotion}
	{#if season === 'christmas'}
		<ChristmasSnowCanvas {pageHidden} />
	{:else}
		<div
			class="season-particles"
			class:confetti={season === 'new-year'}
			class:petals={season === 'tet'}
			class:paused={pageHidden}
			aria-hidden="true"
		>
			{#each particles as particle, i (i)}
				<span
					class="particle"
					style:left={`${particle.x}%`}
					style:--size={`${particle.size}px`}
					style:--duration={`${particle.duration}s`}
					style:--delay={`${particle.delay}s`}
					style:--drift={`${particle.drift}px`}
				></span>
			{/each}
		</div>
	{/if}
{/if}

<style>
	.new-year-countdown {
		margin: 24px auto 0;
		padding: 0 16px;
	}
	.tet-countdown {
		margin-top: 20px;
	}
	.tet-wishes {
		position: relative;
		display: grid;
		place-items: center;
		isolation: isolate;
		max-width: 1256px;
		min-height: 280px;
		margin: 12px auto 0;
		overflow: hidden;
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--festive-red) 6%, transparent),
			transparent 70%
		);
	}
	.blossom-branch {
		position: absolute;
		top: 0;
		width: clamp(180px, 26%, 270px);
		pointer-events: none;
		z-index: -1;
	}
	.peach-branch {
		left: 0;
	}
	.apricot-branch {
		right: 0;
		transform: scaleX(-1);
	}
	.spring-wish {
		padding: 20px 12px;
		text-align: center;
	}
	.spring-kicker {
		color: var(--ink-muted);
		font-size: 11px;
		letter-spacing: 0.12em;
	}
	.spring-wish p {
		margin: 6px 0;
		color: var(--festive-red);
		font-size: clamp(18px, 2.4vw, 26px);
		font-weight: 600;
	}
	.spring-detail {
		color: var(--ink-muted);
		font-size: 12px;
	}
	@media (max-width: 767px) {
		.tet-wishes {
			min-height: 120px;
			margin-top: 6px;
		}
		.blossom-branch {
			width: 145px;
			top: 6px;
		}
		.peach-branch {
			left: -48px;
		}
		.apricot-branch {
			right: -48px;
		}
		.spring-wish {
			max-width: 100%;
		}
		.spring-kicker {
			font-size: 10px;
			letter-spacing: 0.02em;
		}
		.spring-wish p {
			font-size: 17px;
			line-height: 1.6;
		}
		.spring-detail {
			display: none;
		}
		.spring-wish > p {
			max-width: calc(100vw - 130px);
			margin-inline: auto;
		}
	}
	.season-greeting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		max-width: 1256px;
		margin: 36px auto 0;
		padding: 0 8px 8px;
		border-bottom: 1px dashed var(--line);
		color: var(--festive-green);
		font-size: 12px;
	}
	.season-greeting p {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
	}
	.season-greeting p svg {
		width: 36px;
		height: 32px;
		flex-shrink: 0;
	}
	.effect-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 44px;
		padding: 0 10px;
		flex-shrink: 0;
		border: 1px solid transparent;
		border-radius: 12px 9px 13px 8px;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
		transition:
			background 180ms ease,
			border-color 180ms ease;
	}
	.effect-toggle:hover:not(:disabled) {
		background: var(--surface);
		border-color: var(--line);
	}
	.effect-toggle:disabled {
		cursor: default;
	}
	.effect-toggle svg {
		width: 18px;
		height: 18px;
	}
	.effect-state {
		color: var(--festive-green);
	}
	.season-particles {
		position: fixed;
		inset: 0;
		z-index: 30;
		overflow: hidden;
		pointer-events: none;
	}
	.particle {
		position: absolute;
		top: -12px;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--festive-snow);
		opacity: 0;
		animation: particle-fall var(--duration) var(--delay) linear infinite;
	}
	.paused .particle {
		animation-play-state: paused;
	}
	.confetti .particle,
	.petals .particle {
		width: calc(var(--size) + 2px);
		height: calc(var(--size) + 4px);
		background: var(--festive-gold);
		animation-name: celebration-fall;
	}
	.confetti .particle {
		border-radius: 1px;
	}
	.petals .particle {
		border-radius: 80% 10% 70% 30%;
		background: #edcb75;
	}
	.petals .particle:nth-child(2n) {
		background: #e7a5c0;
	}
	.confetti .particle:nth-child(3n) {
		background: var(--festive-red);
	}
	.confetti .particle:nth-child(3n + 1) {
		background: var(--accent);
	}
	@keyframes celebration-fall {
		0% {
			opacity: 0;
			transform: translate3d(0, -12px, 0) rotate(0);
		}
		10%,
		80% {
			opacity: 0.6;
		}
		100% {
			opacity: 0;
			transform: translate3d(var(--drift), calc(100dvh + 24px), 0) rotate(240deg);
		}
	}
	@keyframes particle-fall {
		0% {
			opacity: 0;
			transform: translate3d(0, -12px, 0);
		}
		10%,
		80% {
			opacity: 0.55;
		}
		100% {
			opacity: 0;
			transform: translate3d(var(--drift), calc(100dvh + 24px), 0);
		}
	}
	@media (max-width: 1320px) {
		.season-greeting {
			margin-inline: 32px;
		}
	}
	@media (max-width: 639px) {
		.season-greeting {
			margin-inline: 16px;
			padding-inline: 0;
			gap: 4px;
		}
		.greeting-extra {
			display: none;
		}
		.season-greeting p {
			gap: 5px;
		}
		.season-greeting p svg {
			width: 28px;
		}
		.effect-toggle {
			padding-inline: 5px;
			gap: 4px;
		}
		.particle:nth-child(n + 15) {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.season-particles {
			display: none;
		}
		.effect-toggle {
			transition: none;
		}
	}
</style>
