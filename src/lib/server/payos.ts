export interface PayosEnv {
	PAYOS_CLIENT_ID?: string;
	PAYOS_API_KEY?: string;
	PAYOS_CHECKSUM_KEY?: string;
}

export interface PayosCredentials {
	clientId: string;
	apiKey: string;
	checksumKey: string;
}

const API_URL = 'https://api-merchant.payos.vn/v2/payment-requests';

export function getPayosCredentials(env: PayosEnv | undefined): PayosCredentials | null {
	const clientId = env?.PAYOS_CLIENT_ID?.trim();
	const apiKey = env?.PAYOS_API_KEY?.trim();
	const checksumKey = env?.PAYOS_CHECKSUM_KEY?.trim();
	return clientId && apiKey && checksumKey ? { clientId, apiKey, checksumKey } : null;
}

async function signPaymentRequest(data: string, checksumKey: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(checksumKey),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
	return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function newPayosOrderCode(): number {
	return Date.now() * 1000 + (crypto.getRandomValues(new Uint16Array(1))[0] % 1000);
}

function webhookSignatureData(data: Record<string, unknown>): string {
	return Object.keys(data)
		.sort()
		.filter((key) => data[key] !== undefined)
		.map((key) => {
			let value = data[key];
			if (Array.isArray(value)) {
				value = JSON.stringify(
					value.map((item) =>
						item && typeof item === 'object' && !Array.isArray(item)
							? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
							: item
					)
				);
			}
			if (value === null || value === 'null' || value === 'undefined') value = '';
			return `${key}=${value}`;
		})
		.join('&');
}

export async function verifyPayosWebhook(
	data: Record<string, unknown>,
	signature: string,
	checksumKey: string
): Promise<boolean> {
	if (!/^[a-f\d]{64}$/i.test(signature)) return false;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(checksumKey),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify']
	);
	const bytes = new Uint8Array(signature.match(/../g)!.map((pair) => parseInt(pair, 16)));
	return crypto.subtle.verify('HMAC', key, bytes, encoder.encode(webhookSignatureData(data)));
}

export async function createPayosCheckout(
	credentials: PayosCredentials,
	amount: number,
	origin: string,
	orderCode: number,
	fetcher: typeof fetch = fetch
): Promise<string> {
	const description = 'UNGHO WEB'; // Fits the 9-character bank description limit.
	const callbackUrl = `${origin}/donate/result/${orderCode}`;
	const payload = {
		orderCode,
		amount,
		description,
		returnUrl: callbackUrl,
		cancelUrl: callbackUrl,
		expiredAt: Math.floor(Date.now() / 1000) + 30 * 60,
		signature: await signPaymentRequest(
			`amount=${amount}&cancelUrl=${callbackUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${callbackUrl}`,
			credentials.checksumKey
		)
	};

	const response = await fetcher(API_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-client-id': credentials.clientId,
			'x-api-key': credentials.apiKey
		},
		body: JSON.stringify(payload),
		signal: AbortSignal.timeout(10_000)
	});
	if (!response.ok) throw new Error(`PayOS create failed: ${response.status}`);

	const result: unknown = await response.json();
	if (
		!result ||
		typeof result !== 'object' ||
		!('code' in result) ||
		result.code !== '00' ||
		!('data' in result) ||
		!result.data ||
		typeof result.data !== 'object' ||
		!('checkoutUrl' in result.data) ||
		typeof result.data.checkoutUrl !== 'string'
	) {
		throw new Error('PayOS returned an invalid checkout link');
	}

	const checkoutUrl = new URL(result.data.checkoutUrl);
	if (checkoutUrl.protocol !== 'https:' || checkoutUrl.hostname !== 'pay.payos.vn') {
		throw new Error('PayOS returned an unexpected checkout host');
	}
	return checkoutUrl.href;
}

export async function getPayosPaymentStatus(
	credentials: PayosCredentials,
	orderCode: string,
	fetcher: typeof fetch = fetch
): Promise<'PAID' | 'CANCELLED' | 'PENDING' | 'UNKNOWN'> {
	const response = await fetcher(`${API_URL}/${orderCode}`, {
		headers: { 'x-client-id': credentials.clientId, 'x-api-key': credentials.apiKey },
		cache: 'no-store',
		signal: AbortSignal.timeout(10_000)
	});
	if (!response.ok) throw new Error(`PayOS status failed: ${response.status}`);
	const result: unknown = await response.json();
	if (
		!result ||
		typeof result !== 'object' ||
		!('code' in result) ||
		result.code !== '00' ||
		!('data' in result) ||
		!result.data ||
		typeof result.data !== 'object' ||
		!('orderCode' in result.data) ||
		String(result.data.orderCode) !== orderCode ||
		!('status' in result.data)
	) {
		return 'UNKNOWN';
	}
	const status = result.data.status;
	return status === 'PAID' || status === 'CANCELLED' || status === 'PENDING' ? status : 'UNKNOWN';
}
