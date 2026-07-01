<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import type { Post } from '$lib/types/portfolio';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let { post, close }: { post: Post; close: () => void } = $props();

	let parsedContent = $state('');

	onMount(async () => {
		if (post.content) {
			const html = await marked.parse(post.content);
			parsedContent = html.replace(/<img /g, '<img referrerpolicy="no-referrer" ');
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	transition:fade={{ duration: 200 }}
>
	<div
		class="absolute inset-0 bg-[#302b30]/40 dark:bg-black/60 backdrop-blur-sm"
		onclick={close}
		aria-label="Close modal"
	></div>

	<div
		class="theme-surface post-modal-card relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#302b30] dark:border-zinc-200 shadow-[6px_6px_0px_0px_#302b30] dark:shadow-[6px_6px_0px_0px_#e4e4e7]"
		in:scale={{ start: 0.95, duration: 250, opacity: 0 }}
		out:scale={{ start: 0.95, duration: 200, opacity: 0 }}
	>
		<div
			class="flex items-center justify-between border-b-2 border-[#302b30]/15 dark:border-zinc-700/30 bg-white/40 p-4 sm:px-6"
		>
			<div class="flex items-center gap-3">
				<div class="rounded-full bg-[#bd9ac9]/20 p-2 text-[#bd9ac9]">
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
				<div>
					<h2 class="font-sans text-xl font-bold text-[#302b30] dark:text-zinc-100 sm:text-2xl">{post.title}</h2>
					<div class="flex items-center gap-2 text-sm text-[#302b30]/60 dark:text-zinc-400">
						<span>{post.date}</span>
						<span>&bull;</span>
						<span>{post.readTime}</span>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="rounded-full p-2 text-[#302b30]/60 dark:text-zinc-400 transition-colors hover:bg-[#302b30]/10 dark:hover:bg-zinc-700/30 hover:text-[#302b30] dark:hover:text-zinc-100"
				onclick={close}
				aria-label="Close modal"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="overflow-y-auto p-4 sm:p-8">
			{#if !post.content}
				<div class="py-12 text-center text-[#302b30]/60 dark:text-zinc-400">
					This post has no content yet.
				</div>
			{:else}
				<article class="prose prose-stone prose-headings:font-sans prose-a:text-[#a15f70] dark:prose-invert dark:prose-a:text-[#e8a7b5] max-w-none">
					{@html parsedContent}
				</article>
			{/if}
		</div>
	</div>
</div>

<style>
	.post-modal-card {
		background-color: #fcf7ef;
	}

	:global(html.dark) .post-modal-card {
		background-color: #1a1a1a;
	}

	:global(html.ganyu-theme) .post-modal-card {
		background-color: #edf7fc;
		border-color: #4b6790;
		box-shadow: 6px 6px 0px 0px rgba(75, 103, 144, 0.3);
	}

	:global(html.dark.ganyu-theme) .post-modal-card {
		background-color: #0f172a;
		border-color: rgba(75, 103, 144, 0.3);
		box-shadow: 6px 6px 0px 0px rgba(75, 103, 144, 0.15);
	}

	article :global(img) {
		max-height: 380px;
		width: auto;
		max-width: 100%;
		display: block;
		margin: 1.5rem auto;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}
</style>
