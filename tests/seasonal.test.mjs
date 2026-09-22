import assert from 'node:assert/strict';
import test from 'node:test';
import { getSeason, getHolidayTarget, getCountdown } from '../src/lib/seasonal.ts';

test('Christmas transitions into New Year at midnight in Vietnam', () => {
	for (const [instant, expected] of [
		['2026-11-30T16:59:59Z', null],
		['2026-11-30T17:00:00Z', 'christmas'],
		['2026-12-25T16:59:59Z', 'christmas'],
		['2026-12-25T17:00:00Z', 'new-year'],
		['2026-12-31T16:59:59Z', 'new-year'],
		['2026-12-31T17:00:00Z', 'new-year'],
		['2027-01-07T16:59:59Z', 'new-year'],
		['2027-01-07T17:00:00Z', null]
	])
		assert.equal(getSeason(new Date(instant)), expected, instant);
});

test('countdown targets the correct Vietnam midnight and keeps the current celebration', () => {
	assert.equal(
		getHolidayTarget('new-year', new Date('2026-12-27T00:00:00Z')).timestamp,
		Date.parse('2026-12-31T17:00:00Z')
	);
	assert.equal(getHolidayTarget('new-year', new Date('2027-01-02T00:00:00Z')).year, 2027);
	assert.equal(
		getHolidayTarget('tet', new Date('2026-09-19T00:00:00Z')).timestamp,
		Date.parse('2027-02-05T17:00:00Z')
	);
	assert.equal(getHolidayTarget('tet', new Date('2027-02-06T00:00:00Z')).year, 2027);
	assert.equal(getHolidayTarget('tet', new Date('2027-02-15T16:59:59Z')).year, 2027);
	assert.equal(getHolidayTarget('tet', new Date('2027-02-15T17:00:00Z')).year, 2028);
	assert.equal(
		getHolidayTarget('tet', new Date('2007-02-01T00:00:00Z')).timestamp,
		Date.parse('2007-02-16T17:00:00Z')
	);
});

test('countdown handles units, subsecond boundaries and completion without negative values', () => {
	assert.deepEqual(getCountdown(90_061_000, 0), {
		days: 1,
		hours: 1,
		minutes: 1,
		seconds: 1,
		complete: false
	});
	assert.equal(getCountdown(1000, 999).seconds, 1);
	assert.deepEqual(getCountdown(1000, 1000), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		complete: true
	});
	assert.deepEqual(getCountdown(1000, 5000), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		complete: true
	});
});

test('Tet spans 23 December to 10 January in the Vietnamese lunar calendar', () => {
	// Tet 2027 is February 6; lunar December has 30 days.
	for (const [instant, expected] of [
		['2027-01-29T16:59:59Z', null],
		['2027-01-29T17:00:00Z', 'tet'],
		['2027-02-06T00:00:00Z', 'tet'],
		['2027-02-15T16:59:59Z', 'tet'],
		['2027-02-15T17:00:00Z', null]
	])
		assert.equal(getSeason(new Date(instant)), expected, instant);
});

test('Tet dates move with the lunar year, including years that differ from China', () => {
	assert.equal(getSeason(new Date('2026-02-17T05:00:00Z')), 'tet');
	assert.equal(getSeason(new Date('2028-01-26T05:00:00Z')), 'tet');
	// Vietnam celebrated Tet on Feb 17, 2007; China on Feb 18.
	assert.equal(getSeason(new Date('2007-02-26T16:59:59Z')), 'tet');
	assert.equal(getSeason(new Date('2007-02-26T17:00:00Z')), null);
});

test('ordinary dates and invalid dates leave decorations hidden', () => {
	assert.equal(getSeason(new Date('2026-09-19T05:00:00Z')), null);
	assert.equal(getSeason(new Date('2027-06-01T05:00:00Z')), null);
	assert.equal(getSeason(new Date('invalid')), null);
});
