import { expect, suite, test } from 'vitest';

import { parseAcceptLanguage } from './parse-accept-language';

suite('parseAcceptLanguage', () => {
	test('extract the locales and sort by quality when present', () => {
		[
			{ header: '', expected: [] },
			{ header: 'en', expected: ['en'] },
			{ header: 'en-US,en', expected: ['en-US', 'en'] },
			{ header: 'en-US,en;q=0.9,es;q=0.8', expected: ['en-US', 'en', 'es'] },
			{
				header: 'en-US,fr;q=0.7,en;q=0.9,es;q=0.8',
				expected: ['en-US', 'en', 'es', 'fr'],
			},
			{
				header: 'fr;q=0.7,en;q=0.9,en-US,es;q=0.8',
				expected: ['en-US', 'en', 'es', 'fr'],
			},
			{
				header: 'fr;q = 0.7,en;q =0.9,en-US,es;q= 0.8',
				expected: ['en-US', 'en', 'es', 'fr'],
			},
		].forEach(({ header, expected }) => {
			const result = parseAcceptLanguage(header);
			expect(result).toEqual(expected);
		});
	});
});
