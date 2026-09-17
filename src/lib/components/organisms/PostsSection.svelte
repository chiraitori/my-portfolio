<script lang="ts">
	import PostCard from '$lib/components/molecules/PostCard.svelte';
	import PostFilters from '$lib/components/molecules/PostFilters.svelte';
	import { posts } from '$lib/data/posts';
	import type { Post } from '$lib/types/portfolio';

	let { onSelectPost }: { onSelectPost?: (post: Post) => void } = $props();

	let searchTerm = $state('');
	let selectedTag = $state('All');

	let tags = $derived(['All', ...new Set(posts.flatMap((post) => post.tags))]);
	let filteredPosts = $derived(
		posts.filter((post) => {
			const query = searchTerm.trim().toLowerCase();
			const matchesSearch = [post.title, post.description, ...post.tags].some((value) =>
				value.toLowerCase().includes(query)
			);
			const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

			return matchesSearch && matchesTag;
		})
	);
</script>

<section class="relative flex flex-col gap-6 pt-12">
	<!-- Divider line extending slightly on the sides -->
	<div class="absolute top-0 left-[-1.5px] right-[-1.5px] h-[1px] bg-[#302b30]/20"></div>
	<div class="flex items-center gap-3">
		<svg
			class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[var(--ink)]"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.08a4.5 4.5 0 0 1-2.052 1.238l-3.084.741.741-3.084a4.5 4.5 0 0 1 1.238-2.052L16.862 4.487Zm0 0L19.5 7.125"
			/>
		</svg>
		<h2 class="font-sans text-2xl font-bold text-[var(--ink)]">Recent posts</h2>
	</div>

	<div class="posts-layout grid min-w-0 items-start gap-6">
		<PostFilters {tags} bind:searchTerm bind:selectedTag />

		<div class="flex min-w-0 flex-col gap-5">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold tracking-wider text-[var(--ink-muted)] uppercase"
						>Results</span
					>
					<span
						class="results-badge flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
					>
						<span class="results-badge-dot h-1.5 w-1.5 rounded-full"></span>
						{filteredPosts.length}
					</span>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				{#each filteredPosts as post (post.title)}
					<PostCard {post} onclick={() => onSelectPost?.(post)} />
				{:else}
					<div
						class="rounded-3xl border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-8 text-center text-[var(--ink-muted)]"
					>
						<p>No posts match your filters.</p>
						<button
							type="button"
							class="mt-3 min-h-11 rounded-full border border-[var(--line)] px-4 text-[var(--accent)] hover:bg-[var(--accent-soft)]"
							onclick={() => {
								searchTerm = '';
								selectedTag = 'All';
							}}>Clear filters</button
						>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.results-badge {
		background: var(--accent-soft);
		border-color: var(--line);
		color: var(--accent);
	}
	.results-badge-dot {
		background: var(--accent);
	}
	.posts-layout {
		grid-template-columns: minmax(0, 1fr);
	}
	/* Keep touch layouts in one column even when a phone browser reports a
	   wide CSS viewport because of zoom or desktop-site emulation. */
	@media (min-width: 1024px) and (pointer: fine) {
		.posts-layout {
			grid-template-columns: 220px minmax(0, 1fr);
		}
	}
</style>
