import type { D1Database } from '@cloudflare/workers-types';

export interface DonationEnv {
	DB?: D1Database;
	WEBHOOK_URL?: string;
}

interface DonationRecord {
	order_code: string;
	amount: number;
	message: string;
	notified_at: number | null;
}

export async function saveDonation(
	db: D1Database,
	orderCode: number,
	amount: number,
	message: string
) {
	await db
		.prepare('INSERT INTO donations (order_code, amount, message, created_at) VALUES (?, ?, ?, ?)')
		.bind(String(orderCode), amount, message, Date.now())
		.run();
}

export async function deleteDonation(db: D1Database, orderCode: number) {
	await db
		.prepare('DELETE FROM donations WHERE order_code = ? AND paid_at IS NULL')
		.bind(String(orderCode))
		.run();
}

export async function notifyPaidDonation(
	db: D1Database,
	orderCode: string,
	amount: number,
	webhookUrl: string,
	fetcher: typeof fetch = fetch
): Promise<void> {
	const now = Date.now();
	const claim = await db
		.prepare(
			`UPDATE donations
		SET paid_at = COALESCE(paid_at, ?), notification_claimed_at = ?
		WHERE order_code = ? AND amount = ? AND notified_at IS NULL
		AND (notification_claimed_at IS NULL OR notification_claimed_at < ?)`
		)
		.bind(now, now, orderCode, amount, now - 60_000)
		.run();
	if (!claim.meta.changes) return;

	try {
		const donation = await db
			.prepare(
				'SELECT order_code, amount, message, notified_at FROM donations WHERE order_code = ?'
			)
			.bind(orderCode)
			.first<DonationRecord>();
		if (!donation) throw new Error('Claimed donation disappeared');
		const url = new URL(webhookUrl);
		if (
			url.protocol !== 'https:' ||
			!['discord.com', 'discordapp.com'].includes(url.hostname) ||
			!url.pathname.startsWith('/api/webhooks/')
		) {
			throw new Error('Invalid Discord webhook URL');
		}
		const content = `☕ Có người vừa ủng hộ ${new Intl.NumberFormat('vi-VN').format(amount)}đ · PayOS #${orderCode}`;
		const response = await fetcher(url.href, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				content,
				embeds: donation.message ? [{ description: donation.message, color: 0xbd9ac9 }] : [],
				allowed_mentions: { parse: [] }
			}),
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) throw new Error(`Discord webhook failed: ${response.status}`);
		await db
			.prepare(
				'UPDATE donations SET notified_at = ?, notification_claimed_at = NULL WHERE order_code = ? AND notification_claimed_at = ?'
			)
			.bind(Date.now(), orderCode, now)
			.run();
	} catch (error) {
		await db
			.prepare(
				'UPDATE donations SET notification_claimed_at = NULL WHERE order_code = ? AND notification_claimed_at = ?'
			)
			.bind(orderCode, now)
			.run();
		throw error;
	}
}
