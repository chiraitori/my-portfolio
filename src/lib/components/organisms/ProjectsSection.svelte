<script lang="ts">
	import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
	import type { GitHubProject } from '$lib/types/portfolio';
	import { onMount } from 'svelte';

	const PROJECTS_API = 'https://gh.chiraitori.dev/api/v1/pinned/chiraitori?raw=true';

	let projects = $state<GitHubProject[]>([]);
	let loading = $state(true);
	let failed = $state(false);

	let controller: AbortController | undefined;
	let disposed = false;

	async function loadProjects() {
		controller?.abort();
		const request = new AbortController();
		controller = request;
		loading = true;
		failed = false;
		const timeout = window.setTimeout(() => request.abort(), 15_000);
		try {
			const response = await fetch(PROJECTS_API, { signal: request.signal });
			if (!response.ok) throw new Error('Unable to load pinned repositories');
			const data: unknown = await response.json();
			if (
				!Array.isArray(data) ||
				!data.every(
					(item) =>
						item &&
						typeof item.owner === 'string' &&
						typeof item.repo === 'string' &&
						typeof item.link === 'string' &&
						item.link.startsWith('https://github.com/') &&
						(item.description == null || typeof item.description === 'string') &&
						(item.language == null || typeof item.language === 'string') &&
						(item.languageColor == null || typeof item.languageColor === 'string') &&
						typeof item.stars === 'number' &&
						typeof item.forks === 'number'
				)
			)
				throw new Error('Unexpected projects response');
			if (!disposed && controller === request) projects = data;
		} catch {
			if (!disposed && controller === request) failed = true;
		} finally {
			window.clearTimeout(timeout);
			if (!disposed && controller === request) loading = false;
		}
	}

	onMount(() => {
		void loadProjects();
		return () => {
			disposed = true;
			controller?.abort();
		};
	});
</script>

<section class="relative flex min-w-0 flex-col overflow-hidden pt-12 pb-4">
	<div class="absolute top-0 right-[-1.5px] left-[-1.5px] h-px bg-[#302b30]/20"></div>

	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<svg
				class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[var(--ink)]"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 8.25 4.5 12l3.75 3.75M15.75 8.25 19.5 12l-3.75 3.75M13.5 5.25l-3 13.5"
				/>
			</svg>
			<h2 class="font-sans text-2xl font-bold text-[var(--ink)]">code.work</h2>
		</div>

		<a
			href="https://github.com/chiraitori"
			target="_blank"
			rel="noreferrer"
			class="github-link inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 px-2 text-xs font-semibold text-[var(--ink-muted)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
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
			<div
				class="relative border border-[var(--line)] bg-[var(--surface)] p-6 text-sm text-[var(--ink-muted)]"
			>
				Could not load projects right now. You can still view them on GitHub.
				<button
					type="button"
					class="mt-3 block min-h-11 cursor-pointer font-semibold underline underline-offset-4"
					onclick={loadProjects}>Try again</button
				>
			</div>
		{:else if projects.length}
			<div class="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each projects as project (project.link)}
					<ProjectCard {project} />
				{/each}
			</div>
		{:else}
			<p class="py-6 text-sm text-[var(--ink-muted)]">
				No pinned projects yet. Find more work on GitHub.
			</p>
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
