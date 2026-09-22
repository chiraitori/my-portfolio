import { LunarDate, SolarDate } from 'lunar-date-vn';

export type Season = 'christmas' | 'new-year' | 'tet';

const vietnamDate = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	timeZone: 'Asia/Ho_Chi_Minh'
});

/** All boundaries use Vietnam's calendar, independent of the visitor's timezone. */
export function getSeason(date = new Date()): Season | null {
	if (!Number.isFinite(date.getTime())) return null;
	const parts = vietnamDate.formatToParts(date);
	const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
	const year = get('year');
	const month = get('month');
	const day = get('day');

	// Vietnamese lunar dates (not the Chinese calendar). The library supports 1200–2199.
	if (month <= 3 && year >= 1201 && year <= 2199) {
		const lunar = new SolarDate({ year, month, day, yearIndex: year, hour: 0 })
			.toLunarDate()
			?.get();
		if (
			lunar &&
			!lunar.leap_month &&
			((lunar.month === 12 && lunar.day >= 23) || (lunar.month === 1 && lunar.day <= 10))
		) {
			return 'tet';
		}
	}
	if ((month === 12 && day >= 26) || (month === 1 && day <= 7)) return 'new-year';
	if (month === 12) return 'christmas';
	return null;
}

/** Keep the current celebration at zero until its display window ends. */
export function getHolidayTarget(season: 'new-year' | 'tet', date = new Date()) {
	if (!Number.isFinite(date.getTime())) return null;
	const parts = vietnamDate.formatToParts(date);
	const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
	let year = get('year');
	const month = get('month');
	const day = get('day');
	const midnight = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) - 7 * 60 * 60 * 1000;
	if (season === 'new-year') {
		if (month !== 1 || day > 7) year += 1;
		return { year, timestamp: midnight(year, 1, 1) };
	}
	const tetMidnight = (y: number) => {
		if (y < 1201 || y > 2199) return null;
		const lunar = new LunarDate({
			year: y,
			month: 1,
			day: 1,
			yearIndex: y,
			hour: 0,
			leap_month: false
		});
		lunar.init();
		const solar = lunar.toSolarDate()?.get();
		return solar ? midnight(solar.year, solar.month, solar.day) : null;
	};
	let timestamp = tetMidnight(year);
	if (timestamp === null) return null;
	// Lunar January 1–10 remains a celebration of this year's Tet.
	if (date.getTime() >= timestamp + 10 * 86_400_000) {
		year += 1;
		timestamp = tetMidnight(year);
	}
	return timestamp === null ? null : { year, timestamp };
}

export function getCountdown(target: number, now: number) {
	const secondsLeft = Math.max(0, Math.ceil((target - now) / 1000));
	return {
		days: Math.floor(secondsLeft / 86400),
		hours: Math.floor((secondsLeft % 86400) / 3600),
		minutes: Math.floor((secondsLeft % 3600) / 60),
		seconds: secondsLeft % 60,
		complete: secondsLeft === 0
	};
}

export const holidayThemes = {
	christmas: {
		greeting: 'A little Christmas magic',
		extra: 'for my little corner of the internet',
		hero: 'Merry Christmas, lovely human!',
		footer: 'Wishing you warm drinks, good company, and a little Christmas magic.',
		credit: 'Made with SvelteKit, Love & a little holiday spirit',
		artwork: '/christmas-tree.svg',
		caption: 'merry & cozy',
		effect: 'Snow',
		effectLabel: 'Snowfall',
		storageKey: 'portfolio-christmas-snow'
	},
	'new-year': {
		greeting: 'Hello, new beginnings',
		extra: 'and all the little things yet to come',
		hero: 'Happy New Year, lovely human!',
		footer: 'Here’s to fresh starts, little adventures, and good things ahead.',
		credit: 'Made with SvelteKit, Love & a fresh start',
		artwork: '/new-year-stars.svg',
		caption: 'make a little wish',
		effect: 'Confetti',
		effectLabel: 'Falling confetti',
		storageKey: 'portfolio-new-year-confetti'
	},
	tet: {
		greeting: 'Tết về rồi',
		extra: 'chúc một năm bình an và nhiều niềm vui',
		hero: 'Chúc mừng năm mới, bạn nhé!',
		footer: 'Chúc bạn một năm an khang, nhiều niềm vui và những cuộc gặp gỡ ấm áp.',
		credit: 'Made with SvelteKit, Love & a little lì xì',
		artwork: '/tet-blossoms.svg',
		caption: 'một chút lộc đầu năm',
		effect: 'Petals',
		effectLabel: 'Falling petals',
		storageKey: 'portfolio-tet-petals'
	}
} as const;
