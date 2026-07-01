import type { D1Database } from '@cloudflare/workers-types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';

const ACTIVE_WINDOW_SECONDS = 150;
const HISTORY_DAYS = 14;
const SITE_PATH = '*';
const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ViewerPayloadSchema = z.object({
	visitorId: z.string().regex(VISITOR_ID_PATTERN),
	path: z.string()
		.startsWith('/')
		.transform((val) => {
			const path = val.split(/[?#]/, 1)[0].slice(0, 200);
			return path || '/';
		}),
	recordView: z.boolean().optional().default(false)
});

interface ViewerCounts {
	online: number;
	onPage: number;
	allTime: number;
	pageViews: number;
}

interface DailyCount {
	day: string;
	value: number;
}

function getRecentDays(now: Date): string[] {
	return Array.from({ length: HISTORY_DAYS }, (_, index) => {
		const date = new Date(now);
		date.setUTCDate(date.getUTCDate() - (HISTORY_DAYS - 1 - index));
		return date.toISOString().slice(0, 10);
	});
}

function fillHistory(days: string[], rows: DailyCount[]): number[] {
	const values = new Map(rows.map((row) => [row.day, Number(row.value)]));
	return days.map((day) => values.get(day) ?? 0);
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const env = platform?.env as { DB?: D1Database } | undefined;
	const db = env?.DB;

	if (!db) {
		return json({ message: 'D1 binding "DB" is not configured.' }, { status: 503 });
	}

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return json({ message: 'Invalid JSON body.' }, { status: 400 });
	}

	const parsed = ViewerPayloadSchema.safeParse(body);
	if (!parsed.success) {
		return json({ message: 'Invalid visitor ID or path.', errors: parsed.error.format() }, { status: 400 });
	}

	const { visitorId, path, recordView } = parsed.data;

	const currentDate = new Date();
	const now = Math.floor(currentDate.getTime() / 1000);
	const today = currentDate.toISOString().slice(0, 10);
	const activeSince = now - ACTIVE_WINDOW_SECONDS;

	const inserted = await db
		.prepare(
			`INSERT OR IGNORE INTO visitors
				(visitor_id, first_seen, last_seen, current_path)
			 VALUES (?, ?, ?, ?)`
		)
		.bind(visitorId, now, now, path)
		.run();

	const writes = [
		db
			.prepare('UPDATE visitors SET last_seen = ?, current_path = ? WHERE visitor_id = ?')
			.bind(now, path, visitorId)
	];

	if ((inserted.meta.changes ?? 0) > 0) {
		writes.push(
			db.prepare('UPDATE site_stats SET total_visitors = total_visitors + 1 WHERE id = 1').bind(),
			db
				.prepare(
					`INSERT INTO daily_analytics (day, path, visitors, views)
					 VALUES (?, ?, 1, 0)
					 ON CONFLICT(day, path) DO UPDATE SET
					 	visitors = daily_analytics.visitors + 1`
				)
				.bind(today, SITE_PATH)
		);
	}

	if (recordView === true) {
		writes.push(
			db
				.prepare(
					`INSERT INTO page_views (path, views, updated_at)
					 VALUES (?, 1, ?)
					 ON CONFLICT(path) DO UPDATE SET
					 	views = page_views.views + 1,
					 	updated_at = excluded.updated_at`
				)
				.bind(path, now),
			db
				.prepare(
					`INSERT INTO daily_analytics (day, path, visitors, views)
					 VALUES (?, ?, 0, 1)
					 ON CONFLICT(day, path) DO UPDATE SET
					 	views = daily_analytics.views + 1`
				)
				.bind(today, path)
		);
	}

	await db.batch(writes);

	const historyDays = getRecentDays(currentDate);
	const historyStart = historyDays[0];

	const [counts, siteHistory, pageHistory] = await Promise.all([
		db
			.prepare(
				`SELECT
					(SELECT COUNT(*) FROM visitors WHERE last_seen >= ?) AS online,
					(SELECT COUNT(*) FROM visitors WHERE current_path = ? AND last_seen >= ?) AS onPage,
					(SELECT total_visitors FROM site_stats WHERE id = 1) AS allTime,
					COALESCE((SELECT views FROM page_views WHERE path = ?), 0) AS pageViews`
			)
			.bind(activeSince, path, activeSince, path)
			.first<ViewerCounts>(),
		db
			.prepare(
				`SELECT day, visitors AS value
				 FROM daily_analytics
				 WHERE path = ? AND day >= ?
				 ORDER BY day`
			)
			.bind(SITE_PATH, historyStart)
			.all<DailyCount>(),
		db
			.prepare(
				`SELECT day, views AS value
				 FROM daily_analytics
				 WHERE path = ? AND day >= ?
				 ORDER BY day`
			)
			.bind(path, historyStart)
			.all<DailyCount>()
	]);

	return json({
		online: Number(counts?.online ?? 0),
		onPage: Number(counts?.onPage ?? 0),
		allTime: Number(counts?.allTime ?? 0),
		pageViews: Number(counts?.pageViews ?? 0),
		siteHistory: fillHistory(historyDays, siteHistory.results),
		pageHistory: fillHistory(historyDays, pageHistory.results)
	});
};
