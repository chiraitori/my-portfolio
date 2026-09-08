<script lang="ts">
	import type { GitHubProject } from '$lib/types/portfolio';

	interface Props {
		project: GitHubProject;
		loading?: boolean;
	}

	let { project, loading = false }: Props = $props();
	let failedAvatar = $state<string>();

	let description = $derived(
		project.description?.replaceAll('**', '') || 'No description provided.'
	);
</script>

<article class="min-h-48 min-w-0" class:animate-pulse={loading}>
	{#if loading}
		<div
			class="flex h-full flex-col gap-3 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4"
		>
			<div class="h-3 w-24 bg-[#302b30]/8"></div>
			<div class="h-5 w-3/5 bg-[#302b30]/10"></div>
			<div class="h-3 w-full bg-[#302b30]/6"></div>
			<div class="h-3 w-4/5 bg-[#302b30]/6"></div>
		</div>
	{:else}
		<a
			href={project.link}
			target="_blank"
			rel="noreferrer"
			class="project-card-interactive group flex h-full cursor-pointer flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 text-[var(--ink)] transition-[border-color,background-color] duration-200 hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2"
			aria-label={`Open ${project.repo} on GitHub`}
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
					{#if failedAvatar !== project.owner}<img
							src={`https://github.com/${project.owner}.png?size=32`}
							alt=""
							loading="lazy"
							class="h-4 w-4 rounded-full"
							onerror={() => (failedAvatar = project.owner)}
						/>
					{:else}<span
							class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[9px] text-[var(--accent)]"
							aria-hidden="true">{project.owner.slice(0, 1).toUpperCase()}</span
						>{/if}
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

			<h3 class="mt-3 break-all line-clamp-2 font-sans text-lg font-semibold text-[var(--ink)]">
				{project.repo}
			</h3>
			<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--ink-muted)]">
				{description}
			</p>

			<div
				class="mt-auto flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[var(--ink-muted)]"
			>
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
