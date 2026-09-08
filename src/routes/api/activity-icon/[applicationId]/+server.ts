import type { RequestHandler } from './$types';

interface DiscordRpcApplication {
	icon?: string | null;
	third_party_skus?: Array<{
		sku?: string;
		distributor?: string;
	}>;
	game_data_overrides?: {
		icon_hash?: string | null;
	};
}

const DISCORD_APPLICATION_ID_PATTERN = /^\d{15,25}$/;

function getInitials(label: string) {
	return label
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join('');
}

function escapeSvgText(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

function getFallbackSvg(label: string) {
	const initials = getInitials(label) || '??';
	const safeLabel = escapeSvgText(label);
	const safeInitials = escapeSvgText(initials);

	return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="${safeLabel}">
		<rect width="128" height="128" rx="30" fill="#f1f2f6"/>
		<text x="64" y="72" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="700" fill="#6c6a72">${safeInitials}</text>
	</svg>`;
}

export const GET: RequestHandler = async ({ fetch, params, url }) => {
	const { applicationId } = params;
	const label = (url.searchParams.get('label') ?? 'Activity').slice(0, 100);

	if (!DISCORD_APPLICATION_ID_PATTERN.test(applicationId)) {
		return new Response(getFallbackSvg(label), {
			headers: {
				'content-type': 'image/svg+xml',
				'cache-control': 'public, max-age=86400'
			}
		});
	}

	let iconHash: string | null | undefined;
	let steamAppId: string | undefined;

	try {
		const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/rpc`, {
			signal: AbortSignal.timeout(4000)
		});

		if (response.ok) {
			const application = (await response.json()) as DiscordRpcApplication;
			steamAppId = application.third_party_skus?.find(
				(sku) => sku.distributor === 'steam' && sku.sku
			)?.sku;
			iconHash = application.game_data_overrides?.icon_hash ?? application.icon;
		}
	} catch {
		// Fall back to an inline SVG so the activity row never shows a broken image.
	}

	const candidates: string[] = [];
	if (iconHash && /^[a-zA-Z0-9_]+$/.test(iconHash)) {
		candidates.push(
			`https://cdn.discordapp.com/app-icons/${applicationId}/${iconHash}.png?size=128`
		);
	}
	if (steamAppId && /^\d+$/.test(steamAppId)) {
		candidates.push(
			`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`
		);
	}

	for (const candidate of candidates) {
		try {
			const image = await fetch(candidate, { signal: AbortSignal.timeout(4000) });
			const contentType = image.headers.get('content-type') ?? '';
			if (image.ok && /^image\/(png|jpeg|webp|gif)(;|$)/i.test(contentType)) {
				return new Response(await image.arrayBuffer(), {
					headers: {
						'content-type': contentType,
						'cache-control': 'public, max-age=86400',
						'x-content-type-options': 'nosniff'
					}
				});
			}
			await image.body?.cancel();
		} catch {
			// Try the next source when an image is missing or its CDN is unavailable.
		}
	}

	return new Response(getFallbackSvg(label), {
		headers: {
			'content-type': 'image/svg+xml',
			'cache-control': 'public, max-age=300'
		}
	});
};
