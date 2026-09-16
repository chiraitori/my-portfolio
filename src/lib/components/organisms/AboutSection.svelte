<script lang="ts">
	import { onMount } from 'svelte';
	import avatarUrl from '$lib/assets/avatar.webp';
	import Tooltip from '$lib/components/atoms/Tooltip.svelte';
	import type { StatusInfo } from '$lib/types/portfolio';
	import StatusDot from '$lib/components/atoms/StatusDot.svelte';
	let { status }: { status: StatusInfo } = $props();

	let currentTime = $state('00:00:00');
	let getAge = () => {
		let birthDate = new Date('2005-10-28');
		const ageMs = Date.now() - birthDate.getTime();
		return (ageMs / 31536000000).toFixed(10);
	};
	let age = $state(getAge());

	onMount(() => {
		// Clock & Age interval
		const updateTime = () => {
			currentTime = new Intl.DateTimeFormat('en-GB', {
				timeZone: 'Asia/Ho_Chi_Minh',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).format(new Date());
			age = getAge();
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<section class="relative flex flex-col pt-12 pb-4">
	<!-- Divider line extending slightly on the sides -->
	<div class="absolute top-0 left-[-1.5px] right-[-1.5px] h-[1px] bg-[#302b30]/20"></div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<svg
			class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[var(--ink)]"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
			/>
			<circle stroke-linecap="round" stroke-linejoin="round" cx="12" cy="7" r="4" />
		</svg>
		<h2 class="font-sans text-2xl font-bold text-[var(--ink)]">About me</h2>
	</div>

	<!-- Content -->
	<div class="flex flex-col md:flex-row gap-[30px] items-center md:items-start w-full mt-8">
		<!-- Left Column: Avatar & Info -->
		<div class="flex flex-col gap-4 shrink-0 w-32 md:w-44 pt-4 ml-[20px]">
			<div class="relative w-full aspect-square">
				<!-- Background decorative blob -->
				<div
					class="absolute inset-0 bg-[#e5a6b5]/30 rounded-3xl transform rotate-3 scale-105 -z-10 transition-transform hover:rotate-6 ganyu-blob"
				></div>
				<!-- Fallback background color if image is missing -->
				<div
					class="absolute inset-0 bg-[#fcefe9] rounded-3xl border-2 border-[#302b30] shadow-[4px_4px_0px_0px_#302b30] -z-10 ganyu-border"
				></div>
				<img
					src={avatarUrl}
					alt="Chiraitori Avatar"
					class="w-full h-full object-cover rounded-3xl border-2 border-[#302b30] shadow-[4px_4px_0px_0px_#302b30] ganyu-border"
				/>
			</div>
			<div class="flex flex-col gap-0.5 mt-2 md:mt-4 text-center md:text-left">
				<h2 class="font-sans text-xl md:text-2xl font-bold text-[var(--ink)]">@chiraitori</h2>
				<div
					class="flex items-center justify-center md:justify-start gap-1.5 text-[var(--ink-muted)] font-medium text-sm"
				>
					<StatusDot {status} />
					{status.text}
				</div>
				<div
					class="text-[var(--ink-muted)] font-medium font-mono text-sm mt-0.5"
					aria-live="polite"
				>
					{currentTime}
				</div>
			</div>
		</div>

		<!-- Right Column: Text -->
		<div
			class="flex-1 text-[var(--ink-muted)] leading-relaxed text-base md:text-lg lg:pl-[120px] lg:pr-[30px] pt-4"
		>
			<p class="text-left">
				Hey there, I'm Chiraitori or (Tú) :] I'm a
				<Tooltip tip={age}><span class="about-tag">20</span></Tooltip>
				year old IoT and AI programmer based in Vietnam. My journey into programming began
				<Tooltip tip="2018"><span class="about-tag">2018</span></Tooltip>, and I've been deeply
				involved in the field ever since. While some may find the document about the technology in
				the old year, I find my passion in crafting innovative solutions through code. Recently,
				I've been focusing on honing my skills in
				<Tooltip tip="2020"><span class="about-tag">2020</span></Tooltip>. You'll often find me
				tinkering with
				<Tooltip tip="🥰"
					><a
						href="https://github.com/chiraitori"
						target="_blank"
						rel="noreferrer"
						class="about-tag">open source</a
					></Tooltip
				>, where I contribute to various open source projects. Currently, I'm delving into the
				intricacies of C++ and Python, and the journey is both exhilarating and challenging. I'm
				still studing at
				<Tooltip tip="🏛️"
					><a href="https://iuh.edu.vn/" target="_blank" rel="noreferrer" class="about-tag"
						>Industrial University of Ho Chi Minh City</a
					></Tooltip
				>
				at the third year at the university. Rn i'm iterresting about cosplay i think will be debut soon.
			</p>
		</div>
	</div>
</section>

<style>
	.about-tag {
		display: inline-block;
		padding: 2px 8px;
		margin: 0 2px;
		background-color: #f0e6e1;
		border-radius: 12px 16px 14px 10px / 14px 10px 16px 12px;
		font-weight: 600;
		color: #302b30;
		font-size: 0.9em;
		transition: background-color 200ms ease;
	}
	:global(html.ganyu-theme) .about-tag {
		background-color: #e0f2fe;
		color: #202747;
	}
	:global(html.dark) .about-tag {
		background-color: #2e2624;
		color: #e4e4e7;
	}

	:global(html.ganyu-theme) .ganyu-blob {
		background-color: rgba(117, 157, 202, 0.2);
	}

	:global(html.ganyu-theme) .ganyu-border {
		border-color: #4b6790;
		box-shadow: 4px 4px 0px 0px #4b6790;
	}

	:global(html.dark) .ganyu-border {
		border-color: #e4e4e7;
		box-shadow: 4px 4px 0px 0px #e4e4e7;
	}

	:global(html.dark) .ganyu-blob {
		background-color: rgba(229, 166, 181, 0.2);
	}
</style>
