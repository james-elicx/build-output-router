import { expect, suite, test } from 'vitest';

import type { ImagesConfig } from '@/types/images';

import { formatResizingResponse } from './format-resizing-response';

const baseConfig: ImagesConfig = {
	domains: ['example.com'],
	sizes: [640, 750, 828, 1080, 1200],
	remotePatterns: [{ hostname: '^via\\.placeholder\\.com$' }],
	formats: ['image/avif', 'image/webp'],
};

suite('formatResizingResponse', () => {
	test('applies content security policy from the config', () => {
		const config = { ...baseConfig, contentSecurityPolicy: 'default-src' };
		const imageUrl = new URL('https://localhost/images/1.jpg');

		const newResp = formatResizingResponse(new Response(), imageUrl, config);
		expect(newResp.headers.get('Content-Security-Policy')).toEqual('default-src');
	});

	test('applies content disposition from the config', () => {
		const config = { ...baseConfig, contentDispositionType: 'inline' };
		const imageUrl = new URL('https://localhost/images/1.jpg');

		const newResp = formatResizingResponse(new Response(), imageUrl, config);
		expect(newResp.headers.get('Content-Disposition')).toEqual('inline; filename="1.jpg"');
	});

	test('uses cache ttl from config when no cache header is present', () => {
		const config = baseConfig;
		const imageUrl = new URL('https://localhost/images/1.jpg');

		const newResp = formatResizingResponse(new Response(), imageUrl, config);
		expect(newResp.headers.get('Cache-Control')).toEqual('public, max-age=60');
	});

	test('does not override the cache header when one is present', () => {
		const config = baseConfig;
		const imageUrl = new URL('https://localhost/images/1.jpg');

		const newResp = formatResizingResponse(
			new Response(null, { headers: { 'cache-control': 'test-value' } }),
			imageUrl,
			config,
		);
		expect(newResp.headers.get('Cache-Control')).toEqual('test-value');
	});
});
