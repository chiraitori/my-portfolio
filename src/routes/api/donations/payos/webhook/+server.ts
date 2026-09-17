import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getPayosCredentials,
	getPayosPaymentStatus,
	verifyPayosWebhook,
	type PayosEnv
} from '$lib/server/payos';
import { notifyPaidDonation, type DonationEnv } from '$lib/server/donations';

export const POST: RequestHandler = async ({ request, platform, fetch }) => {
	if (Number(request.headers.get('content-length') || 0) > 16_384)
		return json({ ok: false }, { status: 413 });
	const config = { ...env, ...(platform?.env as (PayosEnv & DonationEnv) | undefined) };
	const credentials = getPayosCredentials(config);
	if (!credentials || !config.DB || !config.WEBHOOK_URL)
		return json({ ok: false }, { status: 503 });

	let payload: unknown;
	try {
		const raw = await request.text();
		if (raw.length > 16_384) return json({ ok: false }, { status: 413 });
		payload = JSON.parse(raw);
	} catch {
		return json({ ok: false }, { status: 400 });
	}
	if (
		!payload ||
		typeof payload !== 'object' ||
		!('data' in payload) ||
		!('signature' in payload) ||
		!payload.data ||
		typeof payload.data !== 'object' ||
		Array.isArray(payload.data) ||
		typeof payload.signature !== 'string'
	) {
		return json({ ok: false }, { status: 400 });
	}
	const data = payload.data as Record<string, unknown>;
	if (!(await verifyPayosWebhook(data, payload.signature, credentials.checksumKey))) {
		return json({ ok: false }, { status: 401 });
	}
	// payOS sends a signed test event when the webhook is registered. It has no matching order.
	if (
		!('success' in payload) ||
		payload.success !== true ||
		data.code !== '00' ||
		!Number.isSafeInteger(data.orderCode) ||
		!Number.isInteger(data.amount) ||
		Number(data.amount) <= 0
	) {
		return json({ ok: true });
	}
	const orderCode = String(data.orderCode);
	try {
		if ((await getPayosPaymentStatus(credentials, orderCode, fetch)) !== 'PAID')
			return json({ ok: true });
		await notifyPaidDonation(config.DB, orderCode, Number(data.amount), config.WEBHOOK_URL, fetch);
		return json({ ok: true });
	} catch (error) {
		console.error(
			'Could not process PayOS donation webhook:',
			error instanceof Error ? error.name : 'unknown error'
		);
		return json({ ok: false }, { status: 502 });
	}
};
