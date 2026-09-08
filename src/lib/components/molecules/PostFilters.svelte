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

<aside class="flex min-w-0 flex-col gap-4">
	<div
		class="theme-surface flex flex-col gap-4 rounded-3xl border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-6 shadow-[4px_4px_0px_0px_rgba(48,43,48,0.03)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] backdrop-blur-md"
	>
		<div class="flex items-center gap-2 border-b border-[var(--line)] pb-3">
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
			<span class="font-sans text-sm font-semibold text-[var(--ink)]">Filters</span>
		</div>

		<div class="flex flex-col gap-3">
			<label for="search-input" class="text-xs font-medium text-[var(--ink-muted)]">Search</label>
			<input
				id="search-input"
				type="search"
				placeholder="Search posts..."
				bind:value={searchTerm}
				class="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] min-h-11 px-4 py-2 text-base transition-colors focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none"
			/>
		</div>

		<div class="mt-2 flex flex-col gap-2">
			<span class="mb-1 text-xs font-medium text-[var(--ink-muted)]">Tags</span>
			<div class="flex flex-wrap gap-1.5">
				{#each tags as tag (tag)}
					<button
						type="button"
						onclick={() => (selectedTag = tag)}
						aria-pressed={selectedTag === tag}
						class="min-h-11 cursor-pointer rounded-full border px-3 py-2 text-xs transition-all {selectedTag ===
						tag
							? 'border-[#302b30] bg-[var(--accent-soft)] font-semibold text-[var(--ink)]'
							: 'border-[var(--line)] bg-transparent text-[var(--ink-muted)] hover:border-[var(--line)] dark:hover:border-[var(--line)]'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	</div>
</aside>
