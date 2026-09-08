<script lang="ts">
	import HeroSection from '$lib/components/organisms/HeroSection.svelte';
	import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
	import SiteNav from '$lib/components/organisms/SiteNav.svelte';
	import WorkShowcase from '$lib/components/organisms/WorkShowcase.svelte';
	import PostModal from '$lib/components/organisms/PostModal.svelte';
	import DiscordStatusCard from '$lib/components/molecules/DiscordStatusCard.svelte';
	import ViewersCard from '$lib/components/molecules/ViewersCard.svelte';
	import { getCustomActivityIcon } from '$lib/data/activity-icons';
	import { getCrunchyrollInfo } from '$lib/data/crunchyroll';
	import { uniqueActivities } from '$lib/data/presence';
	import type {
		LanyardActivity,
		LanyardData,
		Post,
		PresenceActivityInfo,
		SpotifyInfo,
		StatusInfo
	} from '$lib/types/portfolio';
	import { onMount } from 'svelte';

	let selectedPost = $state<Post | null>(null);

	let lanyardData = $state<LanyardData | null>(null);
	let presenceUnavailable = $state(false);

	onMount(() => {
		let socket: WebSocket;
		let disposed = false;
		let heartbeatInterval: number;
		let reconnectTimer: number;
		let connectionTimeout: number;

		const connect = () => {
			if (disposed) return;
			socket = new WebSocket('wss://api.lanyard.rest/socket');
			connectionTimeout = window.setTimeout(() => socket.close(), 15_000);

			socket.onmessage = (event) => {
				if (disposed) return;
				let message;
				try {
					message = JSON.parse(event.data);
				} catch {
					return;
				}
				if (!message || typeof message !== 'object') return;

				if (
					message.op === 1 &&
					Number.isFinite(message.d?.heartbeat_interval) &&
					message.d.heartbeat_interval > 0
				) {
					// Received Hello, start heartbeat
					window.clearInterval(heartbeatInterval);
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
						if (
							!Array.isArray(message.d?.activities) ||
							!['online', 'idle', 'dnd', 'offline'].includes(message.d?.discord_status)
						)
							return;
						window.clearTimeout(connectionTimeout);
						presenceUnavailable = false;
						lanyardData = message.d;
					}
				}
			};

			socket.onclose = () => {
				window.clearInterval(heartbeatInterval);
				window.clearTimeout(connectionTimeout);
				if (disposed) return;
				lanyardData = null;
				presenceUnavailable = true;
				// Try to reconnect in 5 seconds
				if (!disposed) reconnectTimer = window.setTimeout(connect, 5000);
			};
		};

		connect();

		return () => {
			disposed = true;
			window.clearInterval(heartbeatInterval);
			window.clearTimeout(reconnectTimer);
			window.clearTimeout(connectionTimeout);
			if (socket) socket.close();
		};
	});

	let statusInfo = $derived.by<StatusInfo>(() => {
		if (!lanyardData) {
			return {
				text: presenceUnavailable ? 'Status unavailable' : 'Loading status…',
				dotColorClass: 'bg-neutral-400',
				message: presenceUnavailable ? 'Reconnecting to Discord…' : 'Checking Discord activity…',
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
		const isCrunchyroll = /\bcrunchyroll\b/i.test(name);
		const title = activity.details?.trim() || name;
		const subtitle =
			activity.state?.trim() || activity.assets?.large_text || activity.assets?.small_text;
		const customIcon = getCustomActivityIcon(activity);
		const crunchyroll = isCrunchyroll ? getCrunchyrollInfo(activity) : undefined;

		return {
			id: `${activity.application_id ?? name}-${activity.timestamps?.start ?? activity.state ?? title}`,
			kind: isCrunchyroll
				? 'crunchyroll'
				: isCode
					? 'code'
					: activity.type === 0
						? 'game'
						: 'activity',
			label: isCrunchyroll
				? 'Watching on Crunchyroll'
				: isCode
					? 'Coding in VS Code'
					: activity.type === 3
						? `Watching ${name}`
						: activity.type === 0
							? `Playing ${name}`
							: name,
			title,
			subtitle: isCrunchyroll ? crunchyroll?.subtitle : subtitle,
			episode: crunchyroll?.episode,
			imageUrl:
				customIcon?.imageUrl ??
				getActivityImageUrl(activity) ??
				getApplicationIconUrl(activity, name),
			fallbackImageUrl: getApplicationIconUrl(activity, name),
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

		const richActivities = uniqueActivities(lanyardData?.activities ?? [])
			.map(getPresenceActivity)
			.filter((activity): activity is PresenceActivityInfo => Boolean(activity));

		if (richActivities) {
			activities.push(...richActivities);
		}

		return activities.slice(0, 2);
	});
</script>

<svelte:head>
	<title>chiraitori.dev | Portfolio</title>
	<meta
		name="description"
		content="Hi there! I'm Chiraitori, an IoT student building apps, backend services, Discord bots, AI tools, and embedded projects. Welcome to my small corner of the internet."
	/>
</svelte:head>

<SiteNav />

<main id="home" class="mx-auto flex w-full max-w-[1320px] flex-col px-4 pb-12 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
		<!-- Hero Section -->
		<div class="order-1 lg:col-start-1 lg:row-start-1 flex flex-col min-w-0">
			<HeroSection />
		</div>

		<!-- Sidebar Column (Sticky on desktop, middle on mobile) -->
		<div
			class="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:pt-8 min-w-0 flex flex-col gap-5"
		>
			<DiscordStatusCard status={statusInfo} activities={presenceActivities} />
			<div class="hidden lg:block"><ViewersCard /></div>
		</div>

		<!-- Work Showcase Tab Panel -->
		<div class="order-3 lg:col-start-1 lg:row-start-2 flex flex-col min-w-0">
			<WorkShowcase status={statusInfo} onSelectPost={(post) => (selectedPost = post)} />
		</div>
	</div>
</main>

<SiteFooter />

{#if selectedPost}
	<PostModal post={selectedPost} close={() => (selectedPost = null)} />
{/if}
