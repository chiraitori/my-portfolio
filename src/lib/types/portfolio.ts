export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface LanyardActivity {
	type: number;
	name?: string;
	details?: string;
	state?: string;
	application_id?: string;
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	timestamps?: {
		start?: number;
		end?: number;
	};
}

export interface LanyardSpotify {
	song: string;
	artist: string;
	album: string;
	album_art_url: string;
	track_id: string;
	timestamps: {
		start: number;
		end: number;
	};
}

export interface LanyardData {
	discord_status: DiscordStatus;
	activities: LanyardActivity[];
	kv?: Record<string, string>;
	listening_to_spotify: boolean;
	spotify?: LanyardSpotify;
}

export interface LanyardResponse {
	success: boolean;
	data: LanyardData;
}

export interface StatusInfo {
	text: 'Online' | 'Idle' | 'Do Not Disturb' | 'Offline';
	dotColorClass: string;
	message: string;
	location: string;
	love: string;
}

export interface SpotifyInfo {
	track: string;
	artist: string;
	album: string;
	albumArt: string;
	trackId: string;
	timestamps: {
		start: number;
		end: number;
	};
}

export interface PresenceActivityInfo {
	id: string;
	kind: 'spotify' | 'code' | 'game' | 'activity';
	label: string;
	title: string;
	subtitle?: string;
	imageUrl?: string;
	imageAlt: string;
	href?: string;
	timestamps?: {
		start: number;
		end: number;
	};
}

export interface Post {
	title: string;
	description: string;
	readTime: string;
	tags: string[];
	date: string;
	content?: string;
}

export interface GitHubProject {
	owner: string;
	repo: string;
	link: string;
	description: string;
	image: string;
	website?: string;
	language?: string;
	languageColor?: string;
	stars: number;
	forks: number;
}
