<script lang="ts">
	import type { Post } from '$lib/types/portfolio';

	let { post, onclick }: { post: Post; onclick?: () => void } = $props();
</script>

<button
	type="button"
	class="theme-surface post-card-focus group flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl border-[1.5px] border-[#302b30]/15 dark:border-zinc-700/30 bg-white/40 dark:bg-zinc-900/30 p-5 text-left shadow-[4px_4px_0px_0px_rgba(48,43,48,0.01)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/60 dark:hover:bg-zinc-800/40 hover:shadow-[5px_5px_0px_0px_rgba(48,43,48,0.05)] dark:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2"
	{onclick}
>
	<div class="flex items-center gap-4">
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

		<div class="flex flex-col gap-1">
			<h3
				class="post-title-text font-sans relative inline-block text-lg font-semibold text-[#302b30] dark:text-zinc-100 transition-colors"
			>
				<span
					class="post-title-underline border-b-2 border-transparent pb-0.5 transition-all"
				>
					{post.title}
				</span>
			</h3>
			<p class="text-sm text-[#302b30]/70 dark:text-zinc-300/80">{post.description}</p>
		</div>
	</div>

	<div class="shrink-0 rounded-full bg-[#302b30]/5 dark:bg-zinc-700/30 px-3 py-1 text-xs font-medium text-[#302b30]/40 dark:text-zinc-400">
		{post.readTime}
	</div>
</button>

<style>
	.post-card-focus:focus-visible {
		outline-color: #a15f70;
	}
	.post-icon-wrapper {
		border-color: rgba(189, 154, 201, 0.2);
		background-color: #f0e8f8;
		color: #bd9ac9;
	}
	.group:hover .post-title-text {
		color: #a15f70;
	}
	.group:hover .post-title-underline {
		border-color: #d89aaa;
	}

	:global(html.dark) .post-card-focus:focus-visible {
		outline-color: #e8a7b5;
	}
	:global(html.dark) .post-icon-wrapper {
		border-color: rgba(189, 154, 201, 0.3);
		background-color: #3b224c;
		color: #d8b4fe;
	}
	:global(html.dark) .group:hover .post-title-text {
		color: #e8a7b5;
	}
	:global(html.dark) .group:hover .post-title-underline {
		border-color: #e8a7b5;
	}

	:global(html.ganyu-theme) .post-card-focus:focus-visible {
		outline-color: #759dca;
	}
	:global(html.ganyu-theme) .post-icon-wrapper {
		border-color: rgba(117, 157, 202, 0.2);
		background-color: #edf7fc;
		color: #759dca;
	}
	:global(html.ganyu-theme) .group:hover .post-title-text {
		color: #4b6790;
	}
	:global(html.ganyu-theme) .group:hover .post-title-underline {
		border-color: #759dca;
	}
</style>

