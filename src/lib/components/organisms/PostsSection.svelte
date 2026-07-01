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
			const matchesSearch =
				post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query);
			const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

			return matchesSearch && matchesTag;
		})
	);
</script>

<section class="relative flex flex-col gap-6 pt-12">
	<!-- Divider line extending slightly on the sides -->
	<div class="absolute top-0 left-[-1.5px] right-[-1.5px] h-[1px] bg-[#302b30]/20 dark:bg-zinc-700/30"></div>
	<div class="flex items-center gap-3">
		<svg
			class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[#302b30] dark:text-zinc-200"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.08a4.5 4.5 0 0 1-2.052 1.238l-3.084.741.741-3.084a4.5 4.5 0 0 1 1.238-2.052L16.862 4.487Zm0 0L19.5 7.125"
			/>
		</svg>
		<h2 class="font-sans text-2xl font-bold text-[#302b30] dark:text-zinc-100">Recent posts</h2>
	</div>

	<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-4">
		<PostFilters {tags} bind:searchTerm bind:selectedTag />

		<div class="flex flex-col gap-5 md:col-span-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold tracking-wider text-[#302b30]/40 dark:text-zinc-400/60 uppercase">Results</span>
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
						class="rounded-3xl border-[1.5px] border-[#302b30]/15 dark:border-zinc-700/30 bg-white/20 dark:bg-zinc-900/20 p-8 text-center text-[#302b30]/40 dark:text-zinc-400/50"
					>
						No posts match your filters. Try adjusting your search term.
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.results-badge {
		background-color: #fcefe9;
		border-color: rgba(224, 123, 83, 0.2);
		color: #e07b53;
	}
	.results-badge-dot {
		background-color: #e07b53;
	}

	:global(html.dark) .results-badge {
		background-color: #2c1a14;
		border-color: rgba(224, 123, 83, 0.3);
		color: #f08c66;
	}
	:global(html.dark) .results-badge-dot {
		background-color: #f08c66;
	}

	:global(html.ganyu-theme) .results-badge {
		background-color: #edf7fc;
		border-color: rgba(117, 157, 202, 0.2);
		color: #759dca;
	}
	:global(html.ganyu-theme) .results-badge-dot {
		background-color: #759dca;
	}
</style>
