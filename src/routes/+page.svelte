<script lang="ts">
	import HeroSection from '$lib/components/organisms/HeroSection.svelte';
	import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
	import SiteNav from '$lib/components/organisms/SiteNav.svelte';
	import WorkShowcase from '$lib/components/organisms/WorkShowcase.svelte';
	import PostModal from '$lib/components/organisms/PostModal.svelte';
	import DiscordStatusCard from '$lib/components/molecules/DiscordStatusCard.svelte';
	import ViewersCard from '$lib/components/molecules/ViewersCard.svelte';
	import { getCustomActivityIcon } from '$lib/data/activity-icons';
	import type {
		LanyardActivity,
		LanyardData,
		LanyardResponse,
		Post,
		PresenceActivityInfo,
		SpotifyInfo,
		StatusInfo
	} from '$lib/types/portfolio';
	import { onMount } from 'svelte';

	let selectedPost = $state<Post | null>(null);

	let lanyardData = $state<LanyardData | null>(null);

	onMount(() => {
		let socket: WebSocket;
		let heartbeatInterval: number;
		let reconnectTimer: number;

		const connect = () => {
			socket = new WebSocket('wss://api.lanyard.rest/socket');

			socket.onmessage = (event) => {
				const message = JSON.parse(event.data);

				if (message.op === 1) {
					// Received Hello, start heartbeat
					heartbeatInterval = window.setInterval(() => {
						if (socket.readyState === WebSocket.OPEN) {
							socket.send(JSON.stringify({ op: 3 }));
						}
					}, message.d.heartbeat_interval);

					// Send Initialize
					socket.send(
						JSON.stringify({
							op: 2,
							d: {
								subscribe_to_id: '685716988471148552'
							}
						})
					);
				} else if (message.op === 0) {
					// Received Event
					if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
						lanyardData = message.d;
					}
				}
			};

			socket.onclose = () => {
				window.clearInterval(heartbeatInterval);
				// Try to reconnect in 5 seconds
				reconnectTimer = window.setTimeout(connect, 5000);
			};
		};

		connect();

		return () => {
			window.clearInterval(heartbeatInterval);
			window.clearTimeout(reconnectTimer);
			if (socket) socket.close();
		};
	});

	let statusInfo = $derived.by<StatusInfo>(() => {
		if (!lanyardData) {
			return {
				text: 'Offline',
				dotColorClass: 'bg-neutral-400',
				message: "I'm not online right now.",
				location: 'Vietnam',
				love: 'n/a'
			};
		}

		const status = lanyardData.discord_status;
		const customStatus = lanyardData.activities.find((activity) => activity.type === 4)?.state;

		return {
			text:
				status === 'online'
					? 'Online'
					: status === 'idle'
						? 'Idle'
						: status === 'dnd'
							? 'Do Not Disturb'
							: 'Offline',
			dotColorClass:
				status === 'online'
					? 'bg-[#68b78d]'
					: status === 'idle'
						? 'bg-[#d89aaa]'
						: status === 'dnd'
							? 'bg-[#e07b53]'
							: 'bg-neutral-400',
			message:
				customStatus ??
				(status === 'offline' ? "I'm not online right now." : "I'm active on Discord!"),
			location: lanyardData.kv?.location ?? 'Vietnam',
			love: lanyardData.kv?.love ?? lanyardData.kv?.status ?? 'n/a'
		};
	});

	let spotifyInfo = $derived.by<SpotifyInfo | null>(() => {
		const spotify = lanyardData?.spotify;

		if (!lanyardData?.listening_to_spotify || !spotify) {
			return null;
		}

		return {
			track: spotify.song,
			artist: spotify.artist,
			album: spotify.album,
			albumArt: spotify.album_art_url,
			trackId: spotify.track_id,
			timestamps: spotify.timestamps
		};
	});

	function getActivityImageUrl(activity: LanyardActivity) {
		const image = activity.assets?.large_image ?? activity.assets?.small_image;

		if (!image || image.startsWith('spotify:')) {
			return undefined;
		}

		if (image.startsWith('http://') || image.startsWith('https://')) {
			return image;
		}

		if (image.startsWith('mp:external/')) {
			return `https://media.discordapp.net/${image.slice(3)}`;
		}

		if (image.startsWith('attachments/')) {
			return `https://cdn.discordapp.com/${image}`;
		}

		if (!activity.application_id) {
			return undefined;
		}

		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
	}

	function getApplicationIconUrl(activity: LanyardActivity, label: string) {
		if (!activity.application_id) {
			return undefined;
		}

		return `/api/activity-icon/${activity.application_id}?label=${encodeURIComponent(label)}`;
	}

	function getPresenceActivity(activity: LanyardActivity): PresenceActivityInfo | null {
		const name = activity.name?.trim();

		if (!name || activity.type === 4 || name.toLowerCase() === 'spotify') {
			return null;
		}

		const isCode =
			name.toLowerCase().includes('visual studio code') || name.toLowerCase() === 'code';
		const title = activity.details ?? name;
		const subtitle = activity.state ?? activity.assets?.large_text ?? activity.assets?.small_text;
		const customIcon = getCustomActivityIcon(activity);

		return {
			id: `${activity.application_id ?? name}-${activity.timestamps?.start ?? activity.state ?? title}`,
			kind: isCode ? 'code' : activity.type === 0 ? 'game' : 'activity',
			label: isCode ? 'Coding in VS Code' : activity.type === 0 ? `Playing ${name}` : name,
			title,
			subtitle,
			imageUrl:
				customIcon?.imageUrl ??
				getActivityImageUrl(activity) ??
				getApplicationIconUrl(activity, name),
			imageAlt:
				customIcon?.imageAlt ?? activity.assets?.large_text ?? activity.assets?.small_text ?? name
		};
	}

	let presenceActivities = $derived.by<PresenceActivityInfo[]>(() => {
		const activities: PresenceActivityInfo[] = [];

		if (spotifyInfo) {
			activities.push({
				id: `spotify-${spotifyInfo.trackId}`,
				kind: 'spotify',
				label: 'Listening on Spotify',
				title: spotifyInfo.track,
				subtitle: `by ${spotifyInfo.artist}`,
				imageUrl: spotifyInfo.albumArt,
				imageAlt: spotifyInfo.album,
				href: `https://open.spotify.com/track/${spotifyInfo.trackId}`,
				timestamps: spotifyInfo.timestamps
			});
		}

		const richActivities = lanyardData?.activities
			.map(getPresenceActivity)
			.filter((activity): activity is PresenceActivityInfo => Boolean(activity));

		if (richActivities?.[0]) {
			activities.push(richActivities[0]);
		}

		return activities.slice(0, 1);
	});
</script>

<svelte:head>
	<title>chiraitori.dev | Portfolio</title>
	<meta
		name="description"
		content="Hi there! I'm Chiraitori, a tech lead and software engineer. Welcome to my small corner of the internet."
	/>
</svelte:head>

<SiteNav />

<main id="home" class="flex min-h-screen flex-col px-[30px] pb-8 md:pb-12">
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
		<!-- Hero Section -->
		<div class="order-1 lg:col-start-1 lg:row-start-1 flex flex-col min-w-0">
			<HeroSection />
		</div>

		<!-- Sidebar Column (Sticky on desktop, middle on mobile) -->
		<div
			class="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 mt-8 lg:mt-0 flex flex-col gap-5"
		>
			<DiscordStatusCard status={statusInfo} activities={presenceActivities} />
			<ViewersCard />
		</div>

		<!-- Work Showcase Tab Panel -->
		<div class="order-3 lg:col-start-1 lg:row-start-2 flex flex-col min-w-0">
			<WorkShowcase onSelectPost={(post) => (selectedPost = post)} />
		</div>
	</div>
</main>

<SiteFooter />

{#if selectedPost}
	<PostModal post={selectedPost} close={() => (selectedPost = null)} />
{/if}
