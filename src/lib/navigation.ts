import { tick } from 'svelte';

export async function navigateSection(event: MouseEvent, href: string) {
	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
	event.preventDefault();
	if (window.location.hash !== href) {
		window.location.hash = href;
	} else {
		window.dispatchEvent(new Event('hashchange'));
	}
	await tick();
	requestAnimationFrame(() => {
		const target = document.querySelector(href === '#home' ? '#home' : '.showcase-viewport');
		target?.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'instant'
				: 'smooth',
			block: 'start'
		});
	});
}
