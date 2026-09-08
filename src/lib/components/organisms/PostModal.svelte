<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Post } from '$lib/types/portfolio';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let { post, close }: { post: Post; close: () => void } = $props();

	let dialog: HTMLDialogElement;
	let parsedContent = $derived(
		marked
			.parse(post.content ?? '', { async: false })
			.replace(/<img /g, '<img referrerpolicy="no-referrer" ')
	);

	onMount(() => {
		const previousOverflow = document.documentElement.style.overflow;
		const previousFocus =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		dialog.showModal();
		dialog.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.focus();
		document.documentElement.style.overflow = 'hidden';
		return () => {
			dialog.close();
			document.documentElement.style.overflow = previousOverflow;
			previousFocus?.focus({ preventScroll: true });
		};
	});
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="post-title"
	oncancel={(event) => {
		event.preventDefault();
		close();
	}}
	class="post-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-4 sm:p-6"
>
	<button
		type="button"
		class="absolute inset-0 cursor-default"
		tabindex="-1"
		onclick={close}
		aria-label="Close modal backdrop"
	></button>

	<div
		class="theme-surface post-modal-card relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#302b30] shadow-[6px_6px_0px_0px_#302b30] dark:shadow-[6px_6px_0px_0px_#e4e4e7]"
		in:scale={{ start: 0.95, duration: 250, opacity: 0 }}
		out:scale={{ start: 0.95, duration: 200, opacity: 0 }}
	>
		<div
			class="flex items-center justify-between border-b-2 border-[var(--line)] bg-[var(--surface)] p-4 sm:px-6"
		>
			<div class="flex min-w-0 items-center gap-3">
				<div class="rounded-full bg-[#bd9ac9]/20 p-2 text-[var(--accent)]">
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
					<h2 id="post-title" class="font-sans text-xl font-bold text-[var(--ink)] sm:text-2xl">
						{post.title}
					</h2>
					<div class="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
						<span>{post.date}</span>
						<span>&bull;</span>
						<span>{post.readTime}</span>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="min-h-11 min-w-11 shrink-0 rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[#302b30]/10 dark:hover:bg-[var(--surface)] hover:text-[var(--ink)] dark:hover:text-[var(--ink)]"
				onclick={close}
				aria-label="Close modal"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="min-h-0 overflow-y-auto overscroll-contain break-words p-4 sm:p-8">
			{#if !post.content}
				<div class="py-12 text-center text-[var(--ink-muted)]">This post has no content yet.</div>
			{:else}
				<article
					class="prose prose-stone prose-headings:font-sans prose-a:text-[var(--accent)] dark:prose-invert dark:prose-a:text-[var(--accent)] max-w-none"
				>
					{@html parsedContent}
				</article>
			{/if}
		</div>
	</div>
</dialog>

<style>
	.post-dialog[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.post-dialog::backdrop {
		background: rgb(24 20 28 / 65%);
		backdrop-filter: blur(6px);
	}
	.post-modal-card {
		max-height: 100%;
	}
	article :global(pre) {
		max-width: 100%;
		overflow-x: auto;
	}
	.post-modal-card {
		background-color: var(--surface);
	}
	article :global(img) {
		max-height: 380px;
		width: auto;
		max-width: 100%;
		display: block;
		margin: 1.5rem auto;
		border-radius: 16px;
	}
</style>
