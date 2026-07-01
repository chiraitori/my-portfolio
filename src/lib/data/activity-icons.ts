import type { LanyardActivity } from '$lib/types/portfolio';

interface CustomActivityIcon {
	imageUrl: string;
	imageAlt?: string;
}

export const steamIcon = (appId: string) =>
	`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

// Keys can be the activity name, details, asset text, or Discord application_id.
const customActivityIcons: Record<string, CustomActivityIcon> = {
	// Example:
	// 'counter-strike 2': {
	// 	imageUrl: steamIcon('730'),
	// 	imageAlt: 'Counter-Strike 2'
	// }
};

function normalizeActivityKey(value?: string) {
	return value?.trim().toLowerCase();
}

export function getCustomActivityIcon(activity: LanyardActivity) {
	const keys = [
		activity.application_id,
		activity.name,
		activity.details,
		activity.assets?.large_text,
		activity.assets?.small_text
	]
		.map(normalizeActivityKey)
		.filter((key): key is string => Boolean(key));

	for (const key of keys) {
		const icon = customActivityIcons[key];

		if (icon) {
			return icon;
		}
	}

	return undefined;
}
