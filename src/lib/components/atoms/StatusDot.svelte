<script lang="ts">
	import type { StatusInfo } from '$lib/types/portfolio';

	let { status }: { status: StatusInfo } = $props();

	let borderClass = $derived(
		['Offline', 'Loading status…', 'Status unavailable'].includes(status.text)
			? 'border-neutral-400'
			: status.text === 'Online'
				? 'border-[#68b78d]'
				: status.text === 'Idle'
					? 'border-[#d89aaa]'
					: 'border-[#e07b53]'
	);
</script>

<span
	class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 {borderClass}"
	aria-hidden="true"
>
	<span
		class="h-1.5 w-1.5 rounded-full {status.dotColorClass} {[
			'Online',
			'Idle',
			'Do Not Disturb'
		].includes(status.text)
			? 'animate-pulse'
			: ''}"
	></span>
</span>
