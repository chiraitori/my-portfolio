<script lang="ts">
	import AboutSection from '$lib/components/organisms/AboutSection.svelte';
	import PostsSection from '$lib/components/organisms/PostsSection.svelte';
	import ProjectsSection from '$lib/components/organisms/ProjectsSection.svelte';
	import { onMount } from 'svelte';
	import type { Post, StatusInfo } from '$lib/types/portfolio';

	let { onSelectPost, status }: { onSelectPost?: (post: Post) => void; status: StatusInfo } =
		$props();

	type Panel = 'about' | 'posts' | 'projects';

	let activePanel = $state<Panel>('posts');
	let slideDirection = $state(1);
	function syncPanel() {
		const hash = window.location.hash;
		const nextPanel = hash === '#about' ? 'about' : hash === '#projects' ? 'projects' : 'posts';
		const order: Panel[] = ['about', 'posts', 'projects'];
		if (nextPanel !== activePanel) {
			slideDirection = order.indexOf(nextPanel) > order.indexOf(activePanel) ? 1 : -1;
			activePanel = nextPanel;
		}
	}

	onMount(syncPanel);
</script>

<svelte:window onhashchange={syncPanel} />

<div class="showcase-viewport" style:--slide-from={`${slideDirection * 40}px`}>
	<div
		id="about"
		class="showcase-panel"
		class:active={activePanel === 'about'}
		aria-hidden={activePanel !== 'about'}
		inert={activePanel !== 'about'}
	>
		<AboutSection {status} />
	</div>

	<div
		id="posts"
		class="showcase-panel"
		class:active={activePanel === 'posts'}
		aria-hidden={activePanel !== 'posts'}
		inert={activePanel !== 'posts'}
	>
		<PostsSection {onSelectPost} />
	</div>

	<div
		id="projects"
		class="showcase-panel"
		class:active={activePanel === 'projects'}
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
		overflow-x: clip;
		scroll-margin-top: 80px;
	}

	.showcase-panel {
		display: none;
	}
	.showcase-panel.active {
		display: block;
		animation: reveal 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateX(var(--slide-from));
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.showcase-panel.active {
			animation: none;
		}
	}
</style>
