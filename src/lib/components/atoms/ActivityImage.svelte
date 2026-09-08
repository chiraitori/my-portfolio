<script lang="ts">
	let {
		src,
		fallbackSrc,
		alt,
		initials,
		spotify = false,
		poster = false
	}: {
		src?: string;
		fallbackSrc?: string;
		alt: string;
		initials: string;
		spotify?: boolean;
		poster?: boolean;
	} = $props();
	let failed = $state<string[]>([]);
	let currentSrc = $derived([src, fallbackSrc].find((url) => url && !failed.includes(url)));
</script>

<span class="activity-image" class:spotify class:poster role="img" aria-label={alt}>
	<span aria-hidden="true">{initials || '?'}</span>
	{#if currentSrc}
		<img
			src={currentSrc}
			alt=""
			referrerpolicy="no-referrer"
			onerror={() => {
				if (currentSrc) failed = [...failed, currentSrc];
			}}
		/>
	{/if}
</span>

<style>
	.activity-image {
		position: relative;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 9px;
		border: 1px solid var(--line);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 10px;
		font-weight: 700;
	}
	.activity-image.spotify {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
	.activity-image.poster {
		width: 38px;
		height: 56px;
		border-radius: 5px;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: var(--surface);
	}
</style>
