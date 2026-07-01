<script lang="ts">
	import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
	import type { GitHubProject } from '$lib/types/portfolio';
	import { onMount } from 'svelte';

	const PROJECTS_API = 'https://chiraitori-gh-pinned-repo.deno.dev/?username=chiraitori';

	let projects = $state<GitHubProject[]>([]);
	let loading = $state(true);
	let failed = $state(false);

	onMount(() => {
		const controller = new AbortController();

		const loadProjects = async () => {
			try {
				const response = await fetch(PROJECTS_API, { signal: controller.signal });
				if (!response.ok) throw new Error('Unable to load pinned repositories');

				const data: unknown = await response.json();
				if (!Array.isArray(data)) throw new Error('Unexpected projects response');

				projects = data as GitHubProject[];
			} catch (error) {
				if (!(error instanceof DOMException && error.name === 'AbortError')) failed = true;
			} finally {
				loading = false;
			}
		};

		void loadProjects();
		return () => controller.abort();
	});
</script>

<section class="relative flex min-w-0 flex-col overflow-hidden pt-12 pb-4">
	<div class="absolute top-0 right-[-1.5px] left-[-1.5px] h-px bg-[#302b30]/20 dark:bg-zinc-700/30"></div>

	<div class="flex items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<svg
				class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[#302b30] dark:text-zinc-200"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 8.25 4.5 12l3.75 3.75M15.75 8.25 19.5 12l-3.75 3.75M13.5 5.25l-3 13.5"
				/>
			</svg>
			<h2 class="font-sans text-2xl font-bold text-[#302b30] dark:text-zinc-100">code.work</h2>
		</div>

		<a
			href="https://github.com/chiraitori"
			target="_blank"
			rel="noreferrer"
			class="github-link inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 px-2 text-xs font-semibold text-[#302b30]/55 dark:text-zinc-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
		>
			View GitHub
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
			</svg>
		</a>
	</div>

	<div class="relative mt-6" aria-live="polite" aria-busy={loading}>
		{#if loading}
			<div class="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each Array(4) as _, index (index)}
					<ProjectCard
						loading
						project={{
							owner: '',
							repo: '',
							link: '',
							description: '',
							image: '',
							stars: 0,
							forks: 0
						}}
					/>
				{/each}
			</div>
		{:else if failed}
			<div class="relative border border-[#302b30]/15 dark:border-zinc-700/30 bg-white/20 dark:bg-zinc-900/20 p-6 text-sm text-[#302b30]/55 dark:text-zinc-400">
				Không tải được project GitHub lúc này. Bạn vẫn có thể mở GitHub bằng nút phía trên.
			</div>
		{:else if projects.length}
			<div class="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each projects.slice(0, 4) as project (project.link)}
					<ProjectCard {project} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.github-link:hover {
		color: #a15f70;
	}
	.github-link:focus-visible {
		outline-color: #a15f70;
	}

	:global(html.dark) .github-link:hover {
		color: #e8a7b5;
	}
	:global(html.dark) .github-link:focus-visible {
		outline-color: #e8a7b5;
	}

	:global(html.ganyu-theme) .github-link:hover {
		color: #4b6790;
	}
	:global(html.ganyu-theme) .github-link:focus-visible {
		outline-color: #759dca;
	}
</style>
