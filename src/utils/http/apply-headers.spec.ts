import { expect, suite, test } from 'vitest';

import type { MatchPCREResult } from '@/utils/pcre';

import { applyHeaders } from './apply-headers';

suite('applyHeaders', () => {
	test('applies headers from normal object', () => {
		const headers = new Headers({ foo: 'bar' });
		applyHeaders(headers, { other: 'value' });

		expect(Object.fromEntries(headers.entries())).toEqual({
			foo: 'bar',
			other: 'value',
		});
	});

	test('applies headers from headers object', () => {
		const headers = new Headers({ foo: 'bar' });
		applyHeaders(headers, new Headers({ other: 'value' }));

		expect(Object.fromEntries(headers.entries())).toEqual({
			foo: 'bar',
			other: 'value',
		});
	});

	test('applies headers from object with pcre match', () => {
		const headers = new Headers({ foo: 'bar' });
		const pcreMatch: MatchPCREResult = {
			match: ['localhost/index.html', 'index.html'],
			captureGroupKeys: ['path'],
		};
		applyHeaders(headers, { other: 'path/to/$path' }, pcreMatch);

		expect(Object.fromEntries(headers.entries())).toEqual({
			foo: 'bar',
			other: 'path/to/index.html',
		});
	});

	test('appends `set-cookie` headers instead of overriding', () => {
		const headers = new Headers({ 'set-cookie': 'first-value' });
		applyHeaders(headers, { 'set-cookie': 'second-value' });

		expect([...headers.entries()]).toEqual([
			['set-cookie', 'first-value'],
			['set-cookie', 'second-value'],
		]);
	});
});
