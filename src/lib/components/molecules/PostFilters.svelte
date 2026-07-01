<script lang="ts">
	let {
		tags,
		searchTerm = $bindable(),
		selectedTag = $bindable()
	}: {
		tags: string[];
		searchTerm: string;
		selectedTag: string;
	} = $props();
</script>

<aside class="flex flex-col gap-4 md:col-span-1">
	<div
		class="theme-surface flex flex-col gap-4 rounded-3xl border-[1.5px] border-[#302b30]/15 dark:border-zinc-700/30 bg-white/40 dark:bg-zinc-900/30 p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
	>
		<div class="flex items-center gap-2 border-b border-[#302b30]/5 dark:border-zinc-700/20 pb-3">
			<svg
				class="h-4 w-4 fill-none stroke-current stroke-[2]"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
				/>
			</svg>
			<span class="font-sans text-sm font-semibold text-[#302b30] dark:text-zinc-100">Filters</span>
		</div>

		<div class="flex flex-col gap-3">
			<label for="search-input" class="text-xs font-medium text-[#302b30]/50 dark:text-zinc-400/60">Search</label>
			<input
				id="search-input"
				type="search"
				placeholder="Search posts..."
				bind:value={searchTerm}
				class="w-full rounded-xl border border-[#302b30]/20 dark:border-zinc-700/40 bg-white/60 dark:bg-zinc-950/40 px-4 py-2 text-sm transition-colors focus:border-[#a15f70] dark:focus:border-[#e8a7b5] dark:text-zinc-100 focus:outline-none"
			/>
		</div>

		<div class="mt-2 flex flex-col gap-2">
			<span class="mb-1 text-xs font-medium text-[#302b30]/50 dark:text-zinc-400/60">Tags</span>
			<div class="flex flex-wrap gap-1.5">
				{#each tags as tag (tag)}
					<button
						type="button"
						onclick={() => (selectedTag = tag)}
						aria-pressed={selectedTag === tag}
						class="rounded-full border px-3 py-1 text-xs transition-all {selectedTag === tag
							? 'border-[#302b30] dark:border-zinc-100 bg-[#fbeea5] font-semibold text-[#302b30]'
							: 'border-[#302b30]/15 dark:border-zinc-700/30 bg-transparent text-[#302b30]/60 dark:text-zinc-400 hover:border-[#302b30]/35 dark:hover:border-zinc-500'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	</div>
</aside>
