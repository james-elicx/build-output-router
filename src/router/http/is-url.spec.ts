import { expect, suite, test } from 'vitest';

import { isUrl } from './is-url';

suite('isUrl', () => {
	test('returns true for valid url', () => {
		expect(isUrl('https://test.com')).toEqual(true);
	});

	test('returns false for invalid url', () => {
		expect(isUrl('test.com')).toEqual(false);
	});
});
