import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import {
	createPayosCheckout,
	getPayosCredentials,
	newPayosOrderCode,
	type PayosEnv
} from '$lib/server/payos';
import { deleteDonation, saveDonation, type DonationEnv } from '$lib/server/donations';

const MIN_AMOUNT = 10_000;
const MAX_AMOUNT = 2_000_000;

export const POST: RequestHandler = async ({ request, platform, url, fetch }) => {
	const origin = request.headers.get('origin');
	if (origin !== url.origin) {
		return json({ message: 'Invalid request origin.' }, { status: 403 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Invalid JSON body.' }, { status: 400 });
	}
	const amount = body && typeof body === 'object' && 'amount' in body ? body.amount : undefined;
	const message = body && typeof body === 'object' && 'message' in body ? body.message : '';
	if (
		typeof amount !== 'number' ||
		!Number.isInteger(amount) ||
		amount < MIN_AMOUNT ||
		amount > MAX_AMOUNT ||
		amount % 1000 !== 0
	) {
		return json(
			{ message: 'Nhập số tiền từ 10.000đ đến 2.000.000đ, theo bội số 1.000đ.' },
			{ status: 400 }
		);
	}
	if (
		typeof message !== 'string' ||
		message.length > 300 ||
		/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)
	) {
		return json({ message: 'Lời nhắn tối đa 300 ký tự.' }, { status: 400 });
	}

	const credentials = getPayosCredentials({ ...env, ...(platform?.env as PayosEnv | undefined) });
	if (!credentials) {
		return json({ message: 'PayOS chưa được cấu hình trên server.' }, { status: 503 });
	}
	const db = (platform?.env as DonationEnv | undefined)?.DB;
	if (!db) return json({ message: 'Database chưa được cấu hình.' }, { status: 503 });

	const orderCode = newPayosOrderCode();
	try {
		await saveDonation(db, orderCode, amount, message.trim());
		const checkoutUrl = await createPayosCheckout(
			credentials,
			amount,
			url.origin,
			orderCode,
			fetch
		);
		return json({ checkoutUrl }, { headers: { 'cache-control': 'no-store' } });
	} catch (error) {
		console.error('Could not create PayOS checkout:', error);
		try {
			await deleteDonation(db, orderCode);
		} catch (cleanupError) {
			console.error('Could not clean up donation:', cleanupError);
		}
		return json({ message: 'Chưa tạo được link PayOS. Vui lòng thử lại sau.' }, { status: 502 });
	}
};
