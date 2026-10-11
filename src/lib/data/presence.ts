import type { LanyardActivity } from '$lib/types/portfolio';

// Discord may report the same app from several sessions; keep the first entry as highest priority.
export function uniqueActivities(activities: LanyardActivity[]) {
	const result: LanyardActivity[] = [];
	const seen = new Set<string>();

	for (const activity of activities) {
		const normalizedName = activity.name?.trim().toLowerCase().replace(/\s+/g, ' ');
		const applicationKey = activity.application_id ? `app:${activity.application_id}` : undefined;
		const keys =
			activity.type === 0
				? [normalizedName && `game:${normalizedName}`, applicationKey]
				: [applicationKey ?? (normalizedName && `name:${normalizedName}`)];
		const identityKeys = keys.filter((key): key is string => Boolean(key));

		if (identityKeys.length === 0 || identityKeys.some((key) => seen.has(key))) continue;

		identityKeys.forEach((key) => seen.add(key));
		result.push(activity);
	}

	return result;
}
