<script lang="ts">
	import AboutSection from '$lib/components/organisms/AboutSection.svelte';
	import PostsSection from '$lib/components/organisms/PostsSection.svelte';
	import ProjectsSection from '$lib/components/organisms/ProjectsSection.svelte';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types/portfolio';

	let { onSelectPost }: { onSelectPost?: (post: Post) => void } = $props();

	type Panel = 'about' | 'posts' | 'projects';

	let activePanel = $state<Panel>('posts');
	let aboutHeight = $state(0);
	let postsHeight = $state(0);
	let projectsHeight = $state(0);
	let mounted = $state(false);

	let windowWidth = $state(0);
	let lastWindowWidth = $state(0);
	let maxStableHeight = $state(0);

	let currentHeight = $derived(Math.max(aboutHeight, postsHeight, projectsHeight));

	$effect(() => {
		if (windowWidth !== lastWindowWidth) {
			maxStableHeight = currentHeight;
			lastWindowWidth = windowWidth;
		} else {
			maxStableHeight = Math.max(maxStableHeight, currentHeight);
		}
	});

	let stableHeight = $derived(maxStableHeight);

	function syncPanel(e?: HashChangeEvent | Event) {
		let targetHash = window.location.hash;
		
		if (e && 'newURL' in e) {
			try {
				targetHash = new URL((e as HashChangeEvent).newURL).hash;
			} catch (err) {}
		}

		if (targetHash === '#projects') {
			activePanel = 'projects';
		} else if (targetHash === '#posts') {
			activePanel = 'posts';
		} else if (targetHash === '#about') {
			activePanel = 'about';
		}
	}

	onMount(() => {
		syncPanel();
		mounted = true;
	});
</script>

<svelte:window onhashchange={syncPanel} bind:innerWidth={windowWidth} />

<div
	class="showcase-viewport"
	class:mounted
	style:height={stableHeight > 0 ? `${stableHeight}px` : undefined}
>
	<div
		id="about"
		class="showcase-panel"
		class:active={activePanel === 'about'}
		class:inactive-left={activePanel !== 'about'}
		bind:offsetHeight={aboutHeight}
		aria-hidden={activePanel !== 'about'}
		inert={activePanel !== 'about'}
	>
		<AboutSection />
	</div>

	<div
		id="posts"
		class="showcase-panel"
		class:active={activePanel === 'posts'}
		class:inactive-left={activePanel === 'projects'}
		class:inactive-right={activePanel === 'about'}
		bind:offsetHeight={postsHeight}
		aria-hidden={activePanel !== 'posts'}
		inert={activePanel !== 'posts'}
	>
		<PostsSection {onSelectPost} />
	</div>

	<div
		id="projects"
		class="showcase-panel"
		class:active={activePanel === 'projects'}
		class:inactive-right={activePanel !== 'projects'}
		bind:offsetHeight={projectsHeight}
		aria-hidden={activePanel !== 'projects'}
		inert={activePanel !== 'projects'}
	>
		<ProjectsSection />
	</div>
</div>

<style>
	.showcase-viewport {
		position: relative;
		min-width: 0;
		min-height: 38rem;
		overflow: hidden;
		overflow-anchor: none;
		scroll-margin-top: 64px;
	}

	.showcase-panel {
		position: absolute;
		inset: 0 0 auto;
		width: 100%;
		opacity: 0;
		transition:
			transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 360ms ease;
		will-change: transform, opacity;
	}

	.showcase-viewport.mounted {
		min-height: 0;
	}

	.showcase-panel.active {
		z-index: 1;
		opacity: 1;
		transform: translateX(0);
	}

	.showcase-panel.inactive-left {
		pointer-events: none;
		transform: translateX(-105%);
	}

	.showcase-panel.inactive-right {
		pointer-events: none;
		transform: translateX(105%);
	}

	.showcase-viewport:not(.mounted) .showcase-panel {
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.showcase-panel {
			transition-duration: 0.01ms;
		}
	}
</style>
