<script lang="ts">
	import type { Post } from '$lib/types/portfolio';
	import { marked } from 'marked';
	import { onMount, tick } from 'svelte';
	import CloseButton from '$lib/components/atoms/CloseButton.svelte';

	let { post, close }: { post: Post; close: () => void } = $props();

	let dialog: HTMLDialogElement;
	/** Flipped on after the dialog is shown so the enter transition can play. */
	let shown = $state(false);
	/** Guards against re-triggering the exit animation while it plays. */
	let closing = false;
	let enterFrame: number | undefined;

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
		// Wait two frames so the hidden initial state is committed before the
		// `is-open` class flips — otherwise the enter transition is skipped.
		const raf = requestAnimationFrame(() => {
			enterFrame = requestAnimationFrame(() => {
				shown = true;
			});
		});
		return () => {
			cancelAnimationFrame(raf);
			if (enterFrame !== undefined) cancelAnimationFrame(enterFrame);
			dialog.close();
			document.documentElement.style.overflow = previousOverflow;
			previousFocus?.focus({ preventScroll: true });
		};
	});

	let hiddenAt: number | null = null;

	async function resumeAnimationAfterVisibilityChange() {
		if (document.hidden) {
			hiddenAt = performance.now();
			return;
		}
		if (hiddenAt === null || closing || !dialog?.open) {
			hiddenAt = null;
			return;
		}
		hiddenAt = null;
		// If the tab was hidden before the second frame, allow the enter state to
		// commit now; otherwise preserve the transition's current progress.
		if (!shown) {
			shown = true;
			await tick();
		}
		if (document.hidden || closing || !dialog?.open) return;
		requestAnimationFrame(() => {
			for (const animation of dialog.getAnimations({ subtree: true })) {
				const duration = animation.effect?.getTiming().duration;
				if (typeof duration === 'number' && Number(animation.currentTime) >= duration) {
					animation.finish();
				}
			}
		});
	}

	/** Plays the exit animation before the parent actually unmounts the modal. */
	function requestClose() {
		if (closing) return;
		closing = true;
		shown = false;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		setTimeout(close, reduceMotion ? 0 : 240);
	}
</script>

<svelte:document onvisibilitychange={resumeAnimationAfterVisibilityChange} />

<dialog
	bind:this={dialog}
	aria-labelledby="post-title"
	class:is-open={shown}
	oncancel={(event) => {
		event.preventDefault();
		requestClose();
	}}
	class="post-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-4 sm:p-6"
>
	<button
		type="button"
		class="modal-backdrop absolute inset-0 cursor-default"
		tabindex="-1"
		onclick={requestClose}
		aria-label="Close modal backdrop"
	></button>

	<div
		class="theme-surface post-modal-card relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#302b30] shadow-[6px_6px_0px_0px_#302b30] dark:shadow-[6px_6px_0px_0px_#e4e4e7]"
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
			<CloseButton label="Close modal" onclick={requestClose} />
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
		/* Keep the sliding card from creating a temporary dialog scrollbar. */
		overflow: hidden;
	}
	/* The dim/blur lives on an inner layer so it can fade smoothly; the native
	   backdrop stays transparent and only keeps blocking outside interaction. */
	.post-dialog::backdrop {
		background: transparent;
	}
	.modal-backdrop {
		background: transparent;
		opacity: 1;
		transition: opacity 220ms ease;
	}
	.modal-backdrop::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(24 20 28 / 65%);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		opacity: 0;
		transition: opacity 220ms ease;
	}
	.post-dialog[open].is-open .modal-backdrop::before {
		opacity: 1;
	}
	.post-modal-card {
		max-height: 100%;
		background-color: var(--surface);
		opacity: 0;
		transform: translateY(44px);
		transition:
			opacity 240ms ease-in,
			transform 240ms ease-in;
	}
	.post-dialog[open].is-open .post-modal-card {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 340ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 340ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.modal-backdrop,
		.modal-backdrop::before,
		.post-modal-card {
			transition: none;
		}
	}
	article :global(pre) {
		max-width: 100%;
		overflow-x: auto;
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
