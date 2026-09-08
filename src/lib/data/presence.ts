import type { LanyardActivity } from '$lib/types/portfolio';

// Discord may report the same app from several desktop/browser sessions.
export function uniqueActivities(activities: LanyardActivity[]) {
	const byApplication = new Map<string, LanyardActivity>();
	for (const activity of activities) {
		const key = activity.application_id || activity.name?.trim().toLowerCase();
		if (!key) continue;
		const previous = byApplication.get(key);
		if (!previous || (activity.timestamps?.start ?? 0) > (previous.timestamps?.start ?? 0)) {
			byApplication.set(key, activity);
		}
	}
	return [...byApplication.values()];
}
