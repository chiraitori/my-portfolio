import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { notifyPaidDonation } from '../src/lib/server/donations.ts';
import {
	createPayosCheckout,
	getPayosPaymentStatus,
	verifyPayosWebhook
} from '../src/lib/server/payos.ts';

const credentials = {
	clientId: 'test-client',
	apiKey: 'test-api-key',
	checksumKey: 'test-checksum-key'
};

test('creates a signed PayOS request without leaking credentials into the payload', async () => {
	let request;
	const checkoutUrl = await createPayosCheckout(
		credentials,
		50_000,
		'https://chiraitori.dev',
		123456,
		async (url, init) => {
			request = { url, init, body: JSON.parse(init.body) };
			return Response.json({
				code: '00',
				data: { checkoutUrl: 'https://pay.payos.vn/web/example-link' }
			});
		}
	);

	assert.equal(checkoutUrl, 'https://pay.payos.vn/web/example-link');
	assert.equal(request.url, 'https://api-merchant.payos.vn/v2/payment-requests');
	assert.equal(request.init.headers['x-client-id'], credentials.clientId);
	assert.equal(request.init.headers['x-api-key'], credentials.apiKey);
	assert.equal(request.body.amount, 50_000);
	assert.equal(request.body.description.length, 9);
	assert.equal(request.body.returnUrl, request.body.cancelUrl);
	assert.match(request.body.returnUrl, /^https:\/\/chiraitori\.dev\/donate\/result\/\d+$/);
	assert.equal('apiKey' in request.body, false);

	const canonical = `amount=${request.body.amount}&cancelUrl=${request.body.cancelUrl}&description=${request.body.description}&orderCode=${request.body.orderCode}&returnUrl=${request.body.returnUrl}`;
	const expected = createHmac('sha256', credentials.checksumKey).update(canonical).digest('hex');
	assert.equal(request.body.signature, expected);
});

test('sends a donation message once and disables Discord mentions', async () => {
	const donation = {
		order_code: '123456',
		amount: 50_000,
		message: 'Thank you @everyone',
		notified_at: null,
		notification_claimed_at: null
	};
	const db = {
		prepare(sql) {
			return {
				bind(...args) {
					return {
						async run() {
							if (sql.includes('SET paid_at')) {
								if (
									donation.notified_at ||
									donation.notification_claimed_at ||
									args[2] !== donation.order_code ||
									args[3] !== donation.amount
								)
									return { meta: { changes: 0 } };
								donation.notification_claimed_at = args[1];
							} else if (sql.includes('SET notified_at')) donation.notified_at = args[0];
							else if (sql.includes('SET notification_claimed_at'))
								donation.notification_claimed_at = null;
							return { meta: { changes: 1 } };
						},
						async first() {
							return donation;
						}
					};
				}
			};
		}
	};
	let sent = 0;
	const fetcher = async (_url, init) => {
		sent++;
		const payload = JSON.parse(init.body);
		assert.equal(payload.embeds[0].description, donation.message);
		assert.deepEqual(payload.allowed_mentions, { parse: [] });
		return new Response(null, { status: 204 });
	};
	await notifyPaidDonation(
		db,
		'123456',
		50_000,
		'https://discord.com/api/webhooks/1/token',
		fetcher
	);
	await notifyPaidDonation(
		db,
		'123456',
		50_000,
		'https://discord.com/api/webhooks/1/token',
		fetcher
	);
	assert.equal(sent, 1);
	assert.ok(donation.notified_at);
});

test('rejects an unexpected checkout host', async () => {
	await assert.rejects(
		createPayosCheckout(credentials, 20_000, 'https://chiraitori.dev', 123456, async () =>
			Response.json({ code: '00', data: { checkoutUrl: 'https://example.com/not-payos' } })
		),
		/unexpected checkout host/
	);
});

test('verifies PayOS webhook data and rejects modified payment details', async () => {
	const data = { orderCode: 123456, amount: 50_000, code: '00', desc: 'success' };
	const signature = createHmac('sha256', credentials.checksumKey)
		.update('amount=50000&code=00&desc=success&orderCode=123456')
		.digest('hex');
	assert.equal(await verifyPayosWebhook(data, signature, credentials.checksumKey), true);
	assert.equal(
		await verifyPayosWebhook({ ...data, amount: 100_000 }, signature, credentials.checksumKey),
		false
	);
	assert.equal(await verifyPayosWebhook(data, 'bad', credentials.checksumKey), false);
});

test('uses the PayOS server status rather than a return URL claim', async () => {
	const status = await getPayosPaymentStatus(credentials, '123456', async (url, init) => {
		assert.equal(url, 'https://api-merchant.payos.vn/v2/payment-requests/123456');
		assert.equal(init.headers['x-api-key'], credentials.apiKey);
		return Response.json({ code: '00', data: { orderCode: 123456, status: 'PAID' } });
	});
	assert.equal(status, 'PAID');

	const mismatched = await getPayosPaymentStatus(credentials, '123456', async () =>
		Response.json({ code: '00', data: { orderCode: 789, status: 'PAID' } })
	);
	assert.equal(mismatched, 'UNKNOWN');
});
