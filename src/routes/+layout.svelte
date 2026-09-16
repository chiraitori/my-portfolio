<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import EasterEgg from '$lib/components/atoms/EasterEgg.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<EasterEgg />
{@render children()}
