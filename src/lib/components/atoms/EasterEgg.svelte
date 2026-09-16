<script lang="ts">
	import { onMount } from 'svelte';

	const code = 'nnncn';

	onMount(() => {
		let typed = '';
		let audio: HTMLAudioElement | undefined;

		const desktopKeyboard = () =>
			window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches;

		const playEgg = () => {
			audio ??= new Audio('/audio/esteregg.wav');
			audio.currentTime = 0;
			void audio.play().catch(() => {
				// Browsers may block playback when the key event is not a user gesture.
			});
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (!event.isTrusted || !desktopKeyboard() || event.key.length !== 1) return;

			typed = (typed + event.key.toLowerCase()).slice(-code.length);
			if (typed === code) {
				typed = '';
				playEgg();
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			audio?.pause();
			audio = undefined;
		};
	});
</script>
