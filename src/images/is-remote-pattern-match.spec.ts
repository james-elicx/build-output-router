import { expect, suite, test } from 'vitest';

import { isRemotePatternMatch } from './is-remote-pattern-match';
import type { RemotePattern } from './types';

suite('isRemotePatternMatch', () => {
	test('hostname matches correctly', () => {
		const config: RemotePattern = {
			hostname: '^via\\.placeholder\\.com$',
		};

		const validUrl = new URL('https://via.placeholder.com/images/1.jpg');
		expect(isRemotePatternMatch(validUrl, config)).toEqual(true);

		const invalidUrl = new URL('https://example.com/images/1.jpg');
		expect(isRemotePatternMatch(invalidUrl, config)).toEqual(false);
	});

	test('protocol matches correctly', () => {
		const config: RemotePattern = {
			protocol: 'https',
			hostname: '^via\\.placeholder\\.com$',
		};

		const validUrl = new URL('https://via.placeholder.com/images/1.jpg');
		expect(isRemotePatternMatch(validUrl, config)).toEqual(true);

		const invalidUrl = new URL('http://via.placeholder.com/images/1.jpg');
		expect(isRemotePatternMatch(invalidUrl, config)).toEqual(false);
	});

	test('port matches correctly', () => {
		const config: RemotePattern = {
			hostname: '^via\\.placeholder\\.com$',
			port: '9000',
		};

		const validUrl = new URL('https://via.placeholder.com:9000/images/1.jpg');
		expect(isRemotePatternMatch(validUrl, config)).toEqual(true);

		const invalidUrl = new URL('http://via.placeholder.com/images/1.jpg');
		expect(isRemotePatternMatch(invalidUrl, config)).toEqual(false);
	});

	test('pathname matches correctly', () => {
		const config: RemotePattern = {
			hostname: '^via\\.placeholder\\.com$',
			pathname: '^/images/.*$',
		};

		const validUrl = new URL('https://via.placeholder.com:9000/images/1.jpg');
		expect(isRemotePatternMatch(validUrl, config)).toEqual(true);

		const invalidUrl = new URL('http://via.placeholder.com/videos/1.mp4');
		expect(isRemotePatternMatch(invalidUrl, config)).toEqual(false);
	});
});
