<script lang="ts">
	import type { Post } from '$lib/types/portfolio';

	let { post, onclick }: { post: Post; onclick?: () => void } = $props();
</script>

<button
	type="button"
	class="theme-surface post-card-focus group flex min-w-0 w-full cursor-pointer flex-wrap items-center sm:flex-nowrap justify-between gap-4 rounded-3xl border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-5 text-left shadow-[4px_4px_0px_0px_rgba(48,43,48,0.01)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)] hover:shadow-[5px_5px_0px_0px_rgba(48,43,48,0.05)] dark:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2"
	{onclick}
>
	<div class="flex min-w-0 items-center gap-3">
		<div
			class="post-icon-wrapper flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:scale-105"
		>
			<svg
				class="h-5 w-5 fill-none stroke-current stroke-[1.8]"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.08a4.5 4.5 0 0 1-2.052 1.238l-3.084.741.741-3.084a4.5 4.5 0 0 1 1.238-2.052L16.862 4.487Z"
				/>
			</svg>
		</div>

		<div class="flex min-w-0 flex-col gap-1 break-words">
			<h3
				class="post-title-text font-sans relative inline-block text-lg font-semibold text-[var(--ink)] transition-colors"
			>
				<span class="post-title-underline border-b-2 border-transparent pb-0.5 transition-all">
					{post.title}
				</span>
			</h3>
			<p class="text-sm text-[var(--ink-muted)]">{post.description}</p>
		</div>
	</div>

	<div
		class="shrink-0 rounded-full bg-[#302b30]/5 px-3 py-1 text-xs font-medium text-[var(--ink-muted)]"
	>
		{post.readTime}
	</div>
</button>

<style>
	.post-card-focus:focus-visible {
		outline-color: var(--accent);
	}
	.post-icon-wrapper {
		border-color: var(--line);
		background: var(--accent-soft);
		color: var(--accent);
	}
	.group:hover .post-title-text {
		color: var(--accent);
	}
	.group:hover .post-title-underline {
		border-color: var(--accent);
	}
</style>
