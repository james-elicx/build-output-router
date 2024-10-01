import { expect, suite, test } from 'vitest';

import type { ImagesConfig } from '@/types/images';

import { getResizingProperties } from './get-resizing-properties';

const baseUrl = 'https://localhost/_next/image?url=';
const baseValidUrl = `${baseUrl}%2Fimages%2F1.jpg`;
const baseConfig: ImagesConfig = {
	domains: ['example.com'],
	sizes: [640, 750, 828, 1080, 1200],
	remotePatterns: [{ hostname: '^via\\.placeholder\\.com$' }],
	formats: ['image/avif', 'image/webp'],
};

suite('getResizingProperties', () => {
	test('invalid method fails', () => {
		const url = new URL(baseValidUrl);
		const req = new Request(url, { method: 'POST' });

		expect(getResizingProperties(req)).toEqual(undefined);
	});

	suite('request search params', () => {
		test('invalid url fails', () => {
			const url = new URL(baseUrl);
			const req = new Request(url);

			expect(getResizingProperties(req)).toEqual(undefined);
		});

		test('invalid width fails', () => {
			const url = new URL(`${baseValidUrl}&w=abc`);
			const req = new Request(url);

			expect(getResizingProperties(req)).toEqual(undefined);
		});

		test('invalid quality fails', () => {
			const url = new URL(`${baseValidUrl}&w=100&q=abc`);
			const req = new Request(url);

			expect(getResizingProperties(req)).toEqual(undefined);
		});

		test('invalid width in images config fails', () => {
			const url = new URL(`${baseValidUrl}&w=100`);
			const req = new Request(url);

			expect(getResizingProperties(req, baseConfig)).toEqual(undefined);
		});

		test('invalid quality (>100) fails', () => {
			const url = new URL(`${baseValidUrl}&w=640&q=150`);
			const req = new Request(url);

			expect(getResizingProperties(req, baseConfig)).toEqual(undefined);
		});

		test('invalid quality (<0) fails', () => {
			const url = new URL(`${baseValidUrl}&w=640&q=-1`);
			const req = new Request(url);

			expect(getResizingProperties(req, baseConfig)).toEqual(undefined);
		});
	});

	suite('relative (same origin) image', () => {
		test('image with valid request options succeeds', () => {
			const url = new URL(`${baseValidUrl}&w=640`);
			const req = new Request(url);

			const result = getResizingProperties(req, baseConfig);
			expect(result).toEqual({
				isRelative: true,
				imageUrl: new URL('https://localhost/images/1.jpg'),
				options: { format: undefined, width: 640, quality: 75 },
			});
		});

		['/', '%2f', '%2F'].forEach((char) => {
			test(`image with valid request options succeeds (using '${char}'s)`, () => {
				const url = new URL(`${baseUrl}${char}images${char}1.jpg&w=640`);
				const req = new Request(url);

				const result = getResizingProperties(req, baseConfig);
				expect(result).toEqual({
					isRelative: true,
					imageUrl: new URL('https://localhost/images/1.jpg'),
					options: { format: undefined, width: 640, quality: 75 },
				});
			});
		});

		test('svg image fails when config disallows svgs', () => {
			const url = new URL(`${baseValidUrl.replace('jpg', 'svg')}&w=640`);
			const req = new Request(url);
			const config = { ...baseConfig, dangerouslyAllowSVG: false };

			expect(getResizingProperties(req, config)).toEqual(undefined);
		});

		test('svg image succeeds when config allows svgs', () => {
			const url = new URL(`${baseValidUrl.replace('jpg', 'svg')}&w=640`);
			const req = new Request(url);
			const config = { ...baseConfig, dangerouslyAllowSVG: true };

			const result = getResizingProperties(req, config);
			expect(result).toEqual({
				isRelative: true,
				imageUrl: new URL('https://localhost/images/1.svg'),
				options: { format: undefined, width: 640, quality: 75 },
			});
		});

		test('svg image succeeds when config allows them', () => {
			const url = new URL(`${baseValidUrl.replace('jpg', 'svg')}&w=640`);
			const req = new Request(url);
			const config = { ...baseConfig, dangerouslyAllowSVG: true };

			const result = getResizingProperties(req, config);
			expect(result).toEqual({
				isRelative: true,
				imageUrl: new URL('https://localhost/images/1.svg'),
				options: { format: undefined, width: 640, quality: 75 },
			});
		});
	});

	suite('protocol relative (potentially another origin) image', () => {
		const protocolRelativePrefixes = ['%2F%2F', '//', '%2f%2f', '%2f/', '/%2f'];

		protocolRelativePrefixes.forEach((prefix) => {
			test(`image with valid request options succeeds (with ${prefix} prefix)`, () => {
				const url = new URL(`${baseUrl}${prefix}via.placeholder.com%2Fimage.jpg&w=640`);
				const req = new Request(url);
				const result = getResizingProperties(req, baseConfig);
				expect(result).toEqual({
					isRelative: false,
					imageUrl: new URL('https://via.placeholder.com/image.jpg'),
					options: { format: undefined, width: 640, quality: 75 },
				});
			});
		});

		protocolRelativePrefixes.forEach((prefix) => {
			test(`image with disallowed domain fails (with "${prefix}" prefix)`, () => {
				const url = new URL(`${baseUrl}${prefix}invalid.com%2Fimage.jpg&w=640`);
				const req = new Request(url);
				expect(getResizingProperties(req, baseConfig)).toEqual(undefined);
			});
		});
	});

	suite('external image', () => {
		test('external image fails with disallowed domain', () => {
			const url = new URL(`${baseUrl}https%3A%2F%2Finvalid.com%2Fimage.jpg&w=640`);
			const req = new Request(url);

			expect(getResizingProperties(req, baseConfig)).toEqual(undefined);
		});

		test('external image succeeds with allowed domain', () => {
			const url = new URL(`${baseUrl}https%3A%2F%2Fexample.com%2Fimage.jpg&w=640`);
			const req = new Request(url);

			const result = getResizingProperties(req, baseConfig);
			expect(result).toEqual({
				isRelative: false,
				imageUrl: new URL('https://example.com/image.jpg'),
				options: { format: undefined, width: 640, quality: 75 },
			});
		});

		test('external image suceeds with allowed remote pattern', () => {
			const url = new URL(`${baseUrl}https%3A%2F%2Fvia.placeholder.com%2Fimage.jpg&w=640`);
			const req = new Request(url);

			const result = getResizingProperties(req, baseConfig);
			expect(result).toEqual({
				isRelative: false,
				imageUrl: new URL('https://via.placeholder.com/image.jpg'),
				options: { format: undefined, width: 640, quality: 75 },
			});
		});
	});

	suite('request headers', () => {
		test('return correct format for `accept` header (webp)', () => {
			const url = new URL(`${baseValidUrl}&w=640`);
			const req = new Request(url, { headers: { Accept: 'image/webp' } });

			const result = getResizingProperties(req, baseConfig);
			expect(result).toEqual({
				isRelative: true,
				imageUrl: new URL('https://localhost/images/1.jpg'),
				options: { format: 'webp', width: 640, quality: 75 },
			});
		});

		test('return correct format for `accept` header (avif)', () => {
			const url = new URL(`${baseValidUrl}&w=640`);
			const req = new Request(url, {
				headers: { Accept: 'image/avif,image/webp' },
			});

			const result = getResizingProperties(req, baseConfig);
			expect(result).toEqual({
				isRelative: true,
				imageUrl: new URL('https://localhost/images/1.jpg'),
				options: { format: 'avif', width: 640, quality: 75 },
			});
		});
	});
});
