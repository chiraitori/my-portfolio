<script lang="ts">
	import type { GitHubProject } from '$lib/types/portfolio';

	interface Props {
		project: GitHubProject;
		loading?: boolean;
	}

	let { project, loading = false }: Props = $props();

	let description = $derived(
		project.description?.replaceAll('**', '') || 'No description provided.'
	);
</script>

<article class="h-40" class:animate-pulse={loading}>
	{#if loading}
		<div class="flex h-full flex-col gap-3 rounded-3xl border border-[#302b30]/15 dark:border-zinc-700/20 bg-white/20 dark:bg-zinc-900/10 p-4">
			<div class="h-3 w-24 bg-[#302b30]/8 dark:bg-zinc-700/15"></div>
			<div class="h-5 w-3/5 bg-[#302b30]/10 dark:bg-zinc-700/20"></div>
			<div class="h-3 w-full bg-[#302b30]/6 dark:bg-zinc-700/10"></div>
			<div class="h-3 w-4/5 bg-[#302b30]/6 dark:bg-zinc-700/10"></div>
		</div>
	{:else}
		<a
			href={project.link}
			target="_blank"
			rel="noreferrer"
			class="project-card-interactive group flex h-full cursor-pointer flex-col rounded-3xl border border-[#302b30]/15 dark:border-zinc-700/30 bg-white/20 dark:bg-zinc-900/20 p-4 text-[#302b30] dark:text-zinc-200 transition-[border-color,background-color] duration-200 hover:bg-white/35 dark:hover:bg-zinc-800/20 focus-visible:outline-2 focus-visible:outline-offset-2"
			aria-label={`Open ${project.repo} on GitHub`}
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex min-w-0 items-center gap-1.5 text-[11px] text-[#302b30]/60 dark:text-zinc-400">
					<img
						src={`https://github.com/${project.owner}.png?size=32`}
						alt=""
						loading="lazy"
						class="h-4 w-4 rounded-full"
					/>
					<span class="truncate">{project.owner}</span>
				</div>

				<svg
					class="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
				</svg>
			</div>

			<h3 class="mt-3 line-clamp-1 font-sans text-lg font-semibold text-[#302b30] dark:text-zinc-100">
				{project.repo}
			</h3>
			<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-[#302b30]/60 dark:text-zinc-300/80">{description}</p>

			<div class="mt-auto flex items-center gap-3 pt-3 text-[11px] text-[#302b30]/55 dark:text-zinc-400">
				<div class="flex min-w-0 items-center gap-1.5">
					<span
						class="h-2.5 w-2.5 shrink-0 rounded-full border border-black/5 dark:border-white/10"
						style:background-color={project.languageColor ?? '#b8aeb4'}
						aria-hidden="true"
					></span>
					<span class="truncate">{project.language ?? 'Unknown'}</span>
				</div>

				<div class="flex shrink-0 items-center gap-2.5">
					<span class="flex items-center gap-1" aria-label={`${project.stars} stars`}>
						<svg
							viewBox="0 0 24 24"
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							aria-hidden="true"
						>
							<path
								d="m12 2.6 2.8 5.67 6.26.91-4.53 4.42 1.07 6.24L12 16.9l-5.6 2.94 1.07-6.24-4.53-4.42 6.26-.91L12 2.6Z"
							/>
						</svg>
						{project.stars}
					</span>
					<span class="flex items-center gap-1" aria-label={`${project.forks} forks`}>
						<svg
							viewBox="0 0 24 24"
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<circle cx="6" cy="5" r="2" />
							<circle cx="18" cy="5" r="2" />
							<circle cx="12" cy="19" r="2" />
							<path d="M6 7v2c0 2 1.5 3 3 3h6c1.5 0 3-1 3-3V7M12 12v5" />
						</svg>
						{project.forks}
					</span>
				</div>
			</div>
		</a>
	{/if}
</article>

<style>
	.project-card-interactive:hover {
		border-color: rgba(161, 95, 112, 0.45);
	}
	.project-card-interactive:focus-visible {
		outline-color: #a15f70;
	}

	:global(html.dark) .project-card-interactive:hover {
		border-color: rgba(232, 167, 181, 0.45);
	}
	:global(html.dark) .project-card-interactive:focus-visible {
		outline-color: #e8a7b5;
	}

	:global(html.ganyu-theme) .project-card-interactive:hover {
		border-color: rgba(75, 103, 144, 0.45);
	}
	:global(html.ganyu-theme) .project-card-interactive:focus-visible {
		outline-color: #759dca;
	}
</style>
