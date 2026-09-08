import type { LanyardActivity } from '$lib/types/portfolio';

export function getCrunchyrollInfo(activity: LanyardActivity) {
	const fields = [activity.state, activity.assets?.large_text, activity.assets?.small_text]
		.map((value) => value?.trim())
		.filter((value): value is string => Boolean(value));
	const pair = /\bS(\d+)\s*[-·,:/]?\s*E(\d+(?:\.\d+)?)\b|\bE(\d+(?:\.\d+)?)\s*[-·,:/]?\s*S(\d+)\b/i;
	const episodePattern = /\b(?:episode|ep\.?|e)\s*[:#-]?\s*(\d+(?:\.\d+)?)\b/i;
	const seasonPattern = /\b(?:season|s)\s*[:#-]?\s*(\d+)\b/i;
	for (const field of fields) {
		const paired = field.match(pair);
		const episode = paired?.[2] ?? paired?.[3] ?? field.match(episodePattern)?.[1];
		if (!episode) continue;
		const season =
			paired?.[1] ??
			paired?.[4] ??
			fields.map((value) => value.match(seasonPattern)?.[1]).find(Boolean);
		const remainder = (activity.state?.trim() || field)
			.replace(pair, '')
			.replace(episodePattern, '')
			.replace(seasonPattern, '')
			.replace(/^[\s\-–—·,:|/]+|[\s\-–—·,:|/]+$/g, '');
		return {
			episode: `E${Number(episode)}${season ? `S${Number(season)}` : ''}`,
			subtitle: remainder || undefined
		};
	}
	return { episode: undefined, subtitle: fields[0] };
}
