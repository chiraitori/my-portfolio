<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const code = 'nnncn';
	let playing = $state(false);
	let reducedMotion = $state(false);

	onMount(() => {
		let typed = '';
		let audio: HTMLAudioElement | undefined;
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const syncMotion = () => (reducedMotion = motion.matches);
		syncMotion();
		motion.addEventListener('change', syncMotion);

		const playEgg = () => {
			if (!audio) {
				audio = new Audio();
				audio.preload = 'auto';
				audio.src = audio.canPlayType('audio/ogg; codecs="opus"')
					? '/audio/esteregg.ogg'
					: '/audio/esteregg.mp3';
				audio.onplaying = () => (playing = true);
				audio.onpause = audio.onended = audio.onerror = () => (playing = false);
			}
			audio.currentTime = 0;
			void audio.play().catch(() => {
				playing = false;
			});
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (!event.isTrusted || event.repeat || event.isComposing || event.key.length !== 1) return;
			if (event.ctrlKey || event.altKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'p' && audio && !audio.paused) {
				audio.pause();
				audio.currentTime = 0;
				playing = false;
				typed = '';
				return;
			}

			typed = (typed + event.key.toLowerCase()).slice(-code.length);
			if (typed === code) {
				typed = '';
				playEgg();
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			motion.removeEventListener('change', syncMotion);
			if (audio) audio.onplaying = audio.onpause = audio.onended = audio.onerror = null;
			audio?.pause();
			audio = undefined;
		};
	});
</script>

{#if playing}
	<div
		class="egg-hint"
		role="region"
		aria-label="Now playing"
		transition:fly={{ y: -16, duration: reducedMotion ? 0 : 280, easing: cubicOut }}
	>
		<span class="eyebrow">Now playing</span>
		<strong>ニャニャニャチュニャ (NNNCN)</strong>
		<span class="artist">TAK feat. Kotoha</span>
		<div class="egg-links">
			<a
				href="https://music.youtube.com/watch?v=BgPBgTEvi08"
				target="_blank"
				rel="noopener noreferrer">YouTube Music ↗</a
			>
			<a
				href="https://open.spotify.com/album/05iFPVXN6XP8JBwvPwtBK6"
				target="_blank"
				rel="noopener noreferrer">Spotify ↗</a
			>
		</div>
		<span class="stop-hint">Press <kbd>P</kbd> to stop audio</span>
	</div>
{/if}

<style>
	.egg-hint {
		position: fixed;
		top: max(20px, env(safe-area-inset-top));
		right: max(20px, env(safe-area-inset-right));
		z-index: 100;
		width: min(310px, calc(100vw - 40px));
		padding: 16px 18px;
		border: 1px solid var(--line);
		border-radius: 16px 12px 15px 11px;
		background: var(--surface);
		color: var(--ink);
		box-shadow: 0 4px 16px var(--shadow);
		font-size: 14px;
		line-height: 1.5;
	}
	.eyebrow,
	.artist,
	.stop-hint {
		display: block;
		color: var(--ink-muted);
	}
	.eyebrow {
		margin-bottom: 5px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	strong {
		display: block;
		font-size: 15px;
		line-height: 1.4;
	}
	.artist {
		margin-top: 3px;
	}
	.egg-links {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 12px 0;
	}
	a {
		color: var(--accent);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	a:hover {
		color: var(--accent-hover);
	}
	.stop-hint {
		padding-top: 10px;
		border-top: 1px solid var(--line);
		font-size: 12px;
	}
	kbd {
		display: inline-block;
		margin-inline: 3px;
		padding: 0 6px;
		border: 1px solid var(--line);
		border-bottom-width: 2px;
		border-radius: 4px;
		background: var(--accent-soft);
		color: var(--accent);
		font: inherit;
		font-weight: 700;
	}
</style>
