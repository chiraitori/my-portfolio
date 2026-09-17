import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getPayosCredentials, getPayosPaymentStatus, type PayosEnv } from '$lib/server/payos';

export const load: PageServerLoad = async ({ params, platform, fetch, setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	const orderCode = params.orderCode;
	if (!/^\d{1,16}$/.test(orderCode)) return { status: 'UNKNOWN' as const };

	const credentials = getPayosCredentials({ ...env, ...(platform?.env as PayosEnv | undefined) });
	if (!credentials) return { status: 'UNKNOWN' as const };

	try {
		return { status: await getPayosPaymentStatus(credentials, orderCode, fetch) };
	} catch (error) {
		console.error('Could not verify PayOS payment:', error);
		return { status: 'UNKNOWN' as const };
	}
};
