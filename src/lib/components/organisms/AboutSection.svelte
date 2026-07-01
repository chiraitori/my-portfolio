<script lang="ts">
	import { onMount } from 'svelte';
	import avatarUrl from '$lib/assets/avatar.png';
	import Tooltip from '$lib/components/atoms/Tooltip.svelte';

	let currentTime = $state('00:00:00');
	let discordStatus = $state('Offline');
	let discordColor = $state('#747f8d');

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

		// Lanyard WebSocket
		let lanyard: WebSocket;
		let heartbeatInterval: ReturnType<typeof setInterval>;

		function connectLanyard() {
			lanyard = new WebSocket('wss://api.lanyard.rest/socket');

			lanyard.onmessage = (e) => {
				const json = JSON.parse(e.data);
				const { op, d } = json;

				if (op === 1) {
					// Hello
					const pulse = d.heartbeat_interval;
					lanyard.send(JSON.stringify({ op: 2, d: { subscribe_to_id: '685716988471148552' } }));
					heartbeatInterval = setInterval(() => {
						if (lanyard.readyState === WebSocket.OPEN) {
							lanyard.send(JSON.stringify({ op: 3 }));
						}
					}, pulse);
				} else if (op === 0) {
					// Event
					const statusMap: Record<string, { label: string; color: string }> = {
						online: { label: 'Online', color: '#43b581' },
						idle: { label: 'Idle', color: '#faa61a' },
						dnd: { label: 'Do Not Disturb', color: '#f04747' },
						offline: { label: 'Offline', color: '#747f8d' }
					};
					const st = d.discord_status || 'offline';
					discordStatus = statusMap[st]?.label || 'Offline';
					discordColor = statusMap[st]?.color || '#747f8d';
				}
			};

			lanyard.onclose = () => {
				clearInterval(heartbeatInterval);
				setTimeout(connectLanyard, 3000);
			};
		}

		connectLanyard();

		return () => {
			clearInterval(interval);
			clearInterval(heartbeatInterval);
			lanyard?.close();
		};
	});
</script>

<section class="relative flex flex-col pt-12 pb-4">
	<!-- Divider line extending slightly on the sides -->
	<div
		class="absolute top-0 left-[-1.5px] right-[-1.5px] h-[1px] bg-[#302b30]/20 dark:bg-zinc-700/30"
	></div>

	<!-- Header -->
	<div class="flex items-center gap-3">
		<svg
			class="h-6 w-6 fill-none stroke-current stroke-[1.8] text-[#302b30] dark:text-zinc-200"
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
		<h2 class="font-sans text-2xl font-bold text-[#302b30] dark:text-zinc-100">About me</h2>
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
					class="absolute inset-0 bg-[#fcefe9] dark:bg-zinc-800 rounded-3xl border-2 border-[#302b30] shadow-[4px_4px_0px_0px_#302b30] -z-10 ganyu-border"
				></div>
				<img
					src={avatarUrl}
					alt="Chiraitori Avatar"
					class="w-full h-full object-cover rounded-3xl border-2 border-[#302b30] shadow-[4px_4px_0px_0px_#302b30] ganyu-border"
				/>
			</div>
			<div class="flex flex-col gap-0.5 mt-2 md:mt-4 text-center md:text-left">
				<h2 class="font-sans text-xl md:text-2xl font-bold text-[#302b30] dark:text-zinc-100">
					@chiraitori
				</h2>
				<div
					class="flex items-center justify-center md:justify-start gap-1.5 text-[#302b30]/60 dark:text-zinc-400 font-medium text-sm"
				>
					<span
						class="h-2.5 w-2.5 rounded-full border border-black/10"
						style="background-color: {discordColor}"
					></span>
					{discordStatus}
				</div>
				<div
					class="text-[#302b30]/60 dark:text-zinc-400 font-medium font-mono text-sm mt-0.5"
					aria-live="polite"
				>
					{currentTime}
				</div>
			</div>
		</div>

		<!-- Right Column: Text -->
		<div
			class="flex-1 text-[#302b30]/80 dark:text-zinc-300 leading-loose text-lg md:text-xl md:pl-[120px] pr-[30px] pt-4"
		>
			<p class="text-justify md:text-left">
				Hey there, I'm Chiraitori or (Tú) :] I'm a
				<Tooltip tip={age}><span class="about-tag">20</span></Tooltip>
				year old IoT and AI programmer based in Vietnam. My journey into programming began
				<Tooltip tip="2018"><span class="about-tag">2018</span></Tooltip>, and I've been deeply
				involved in the field ever since. While some may find the document about the technology in
				the old year, I find my passion in crafting innovative solutions through code. Recently,
				I've been focusing on honing my skills in
				<Tooltip tip="2020"><span class="about-tag">2020</span></Tooltip>. You'll often find me
				tinkering with
				<Tooltip tip="🥰"><a href="https://github.com/chiraitori" target="_blank" rel="noreferrer" class="about-tag">open source</a></Tooltip>, where I contribute
				to various open source projects. Currently, I'm delving into the intricacies of C++ and
				Python, and the journey is both exhilarating and challenging. I'm still studing at
				<Tooltip tip="🏛️"
					><a href="https://iuh.edu.vn/" target="_blank" rel="noreferrer" class="about-tag">Industrial University of Ho Chi Minh City</a></Tooltip
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
		background-color: #f0e6e1; /* beige-ish pill background */
		border-radius: 12px 16px 14px 10px / 14px 10px 16px 12px; /* Irregular pill shape */
		font-weight: 600;
		color: #302b30;
		font-size: 0.9em;
		transition: background-color 200ms ease;
	}

	:global(html.ganyu-theme) .about-tag {
		background-color: #e0f2fe; /* light blue */
		color: #202747;
	}

	:global(html.ganyu-theme) .ganyu-blob {
		background-color: rgba(117, 157, 202, 0.2);
	}

	:global(html.ganyu-theme) .ganyu-border {
		border-color: #4b6790;
		box-shadow: 4px 4px 0px 0px #4b6790;
	}

	:global(html.dark) .about-tag {
		background-color: #2e2624;
		color: #e4e4e7;
	}

	:global(html.dark) .ganyu-border {
		border-color: #e4e4e7;
		box-shadow: 4px 4px 0px 0px #e4e4e7;
	}

	:global(html.dark) .ganyu-blob {
		background-color: rgba(229, 166, 181, 0.2);
	}
</style>
