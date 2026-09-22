<script lang="ts">
	import HeroSection from '$lib/components/organisms/HeroSection.svelte';
	import HolidaySeason from '$lib/components/molecules/HolidaySeason.svelte';
	import { getSeason, type Season } from '$lib/seasonal';
	import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';
	import SiteNav from '$lib/components/organisms/SiteNav.svelte';
	import WorkShowcase from '$lib/components/organisms/WorkShowcase.svelte';
	import PostModal from '$lib/components/organisms/PostModal.svelte';
	import DiscordStatusCard from '$lib/components/molecules/DiscordStatusCard.svelte';
	import DonateSheet from '$lib/components/molecules/DonateSheet.svelte';
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
	let donationOpen = $state(false);
	let season = $state<Season | null>(null);

	onMount(() => {
		// Local previews never override the calendar on the deployed site.
		const preview = import.meta.env.DEV
			? new URLSearchParams(window.location.search).get('season')
			: null;
		const previewSeason =
			preview === 'christmas' || preview === 'new-year' || preview === 'tet' ? preview : null;
		const updateSeason = () => (season = previewSeason ?? getSeason());
		updateSeason();
		const timer = window.setInterval(updateSeason, 60_000);
		document.addEventListener('visibilitychange', updateSeason);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener('visibilitychange', updateSeason);
		};
	});

	let lanyardData = $state<LanyardData | null>(null);
	let presenceUnavailable = $state(false);

	onMount(() => {
		const lanyardUrl = 'wss://api.lanyard.rest/socket';
		const discordUserId = '685716988471148552';
		let socket: WebSocket | null = null;
		let disposed = false;
		let pageFrozen = false;
		let heartbeatTimer: number | undefined;
		let reconnectTimer: number | undefined;
		let connectionTimeout: number | undefined;
		let reconnectAttempts = 0;
		let reconnectDelayOverride: number | undefined;
		let lastPresenceSignature = '';

		const clearHeartbeat = () => {
			if (heartbeatTimer !== undefined) {
				window.clearInterval(heartbeatTimer);
				heartbeatTimer = undefined;
			}
		};

		const sendHeartbeat = () => {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ op: 3 }));
			}
		};

		const startHeartbeat = (interval: number) => {
			clearHeartbeat();
			const safeInterval = Math.max(1000, Math.round(interval));
			heartbeatTimer = window.setInterval(sendHeartbeat, safeInterval);
		};

		const getPresenceData = (message: unknown): LanyardData | null => {
			if (!message || typeof message !== 'object') return null;
			const event = message as {
				op?: unknown;
				t?: unknown;
				d?: unknown;
			};
			if (event.op !== 0 || (event.t !== 'INIT_STATE' && event.t !== 'PRESENCE_UPDATE')) {
				return null;
			}

			let data = event.d;
			// INIT_STATE is a map when subscribing with subscribe_to_ids. Keep support
			// for the old single-user shape so a server response can be upgraded safely.
			if (
				event.t === 'INIT_STATE' &&
				data &&
				typeof data === 'object' &&
				!Array.isArray(data) &&
				discordUserId in data &&
				typeof (data as Record<string, unknown>)[discordUserId] === 'object'
			) {
				data = (data as Record<string, unknown>)[discordUserId];
			}

			if (!data || typeof data !== 'object') return null;
			const candidate = data as Partial<LanyardData>;
			if (
				!Array.isArray(candidate.activities) ||
				!['online', 'idle', 'dnd', 'offline'].includes(candidate.discord_status ?? '')
			) {
				return null;
			}

			return candidate as LanyardData;
		};

		const getPresenceSignature = (data: LanyardData) =>
			JSON.stringify({
				status: data.discord_status,
				activities: data.activities,
				listening_to_spotify: data.listening_to_spotify,
				spotify: data.spotify,
				kv: data.kv
			});

		const scheduleReconnect = (delayOverride?: number) => {
			if (disposed || pageFrozen || reconnectTimer !== undefined) return;
			const baseDelay =
				delayOverride ?? Math.min(30_000, 750 * 2 ** Math.min(reconnectAttempts, 5));
			const jitter = delayOverride === undefined ? Math.round(baseDelay * Math.random() * 0.25) : 0;
			reconnectAttempts += 1;
			reconnectTimer = window.setTimeout(() => {
				reconnectTimer = undefined;
				connect();
			}, baseDelay + jitter);
		};

		const connect = () => {
			if (disposed || pageFrozen) return;
			if (
				socket &&
				(socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
			) {
				return;
			}

			const nextSocket = new WebSocket(lanyardUrl);
			socket = nextSocket;
			connectionTimeout = window.setTimeout(() => {
				if (socket === nextSocket && nextSocket.readyState !== WebSocket.OPEN) nextSocket.close();
			}, 15_000);

			nextSocket.onmessage = (event) => {
				if (disposed || pageFrozen || socket !== nextSocket) return;
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
					startHeartbeat(message.d.heartbeat_interval);
					nextSocket.send(
						JSON.stringify({
							op: 2,
							d: {
								subscribe_to_ids: [discordUserId]
							}
						})
					);
					return;
				}

				const data = getPresenceData(message);
				if (data) {
					reconnectAttempts = 0;
					if (connectionTimeout !== undefined) {
						window.clearTimeout(connectionTimeout);
						connectionTimeout = undefined;
					}
					presenceUnavailable = false;
					const signature = getPresenceSignature(data);
					if (signature !== lastPresenceSignature) {
						lastPresenceSignature = signature;
						lanyardData = data;
					}
					return;
				}

				if (message.op === 7 || message.op === 9) {
					reconnectDelayOverride = message.op === 7 ? 250 : 1000;
					nextSocket.close();
				}
			};

			nextSocket.onerror = () => {
				if (socket === nextSocket) nextSocket.close();
			};
			nextSocket.onclose = () => {
				if (socket !== nextSocket) return;
				socket = null;
				clearHeartbeat();
				if (connectionTimeout !== undefined) {
					window.clearTimeout(connectionTimeout);
					connectionTimeout = undefined;
				}
				if (disposed || pageFrozen) return;
				if (!lanyardData) presenceUnavailable = true;
				const delay = reconnectDelayOverride;
				reconnectDelayOverride = undefined;
				scheduleReconnect(delay);
			};
		};

		const pauseConnection = () => {
			pageFrozen = true;
			reconnectDelayOverride = undefined;
			clearHeartbeat();
			if (reconnectTimer !== undefined) {
				window.clearTimeout(reconnectTimer);
				reconnectTimer = undefined;
			}
			if (connectionTimeout !== undefined) {
				window.clearTimeout(connectionTimeout);
				connectionTimeout = undefined;
			}
			const oldSocket = socket;
			socket = null;
			if (oldSocket && oldSocket.readyState < WebSocket.CLOSING) oldSocket.close();
		};

		const resumeConnection = () => {
			if (!pageFrozen || disposed) return;
			pageFrozen = false;
			reconnectAttempts = 0;
			connect();
		};

		window.addEventListener('pagehide', pauseConnection);
		window.addEventListener('pageshow', resumeConnection);
		connect();

		return () => {
			disposed = true;
			window.removeEventListener('pagehide', pauseConnection);
			window.removeEventListener('pageshow', resumeConnection);
			pauseConnection();
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

<SiteNav {season} />
{#if season}
	{#key season}<HolidaySeason {season} />{/key}
{/if}

<main id="home" class="mx-auto flex w-full max-w-[1320px] flex-col px-4 pb-12 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
		<!-- Hero Section -->
		<div class="order-1 lg:col-start-1 lg:row-start-1 flex flex-col min-w-0">
			<HeroSection {season} {donationOpen} onOpenDonation={() => (donationOpen = true)} />
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

<SiteFooter {season} />

<DonateSheet open={donationOpen} close={() => (donationOpen = false)} />

{#if selectedPost}
	<PostModal post={selectedPost} close={() => (selectedPost = null)} />
{/if}
