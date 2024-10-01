import { expect, suite, test } from 'vitest';

import { applySearchParams } from './apply-search-params';

suite('applySearchParams', () => {
	test('merges search params onto target', () => {
		const source = new URL('http://localhost/page?foo=bar');
		const target = new URL('http://localhost/page?other=value');

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(1);

		applySearchParams(target.searchParams, source.searchParams);

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(2);

		expect(target.toString()).toEqual('http://localhost/page?other=value&foo=bar');
	});

	test('allows multiple query params with the same key', () => {
		const source = new URL('http://localhost/page?foo=bar');
		const target = new URL('http://localhost/page?other=value&foo=baz&foo=test');

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(3);

		applySearchParams(target.searchParams, source.searchParams);

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(4);

		expect(target.toString()).toEqual('http://localhost/page?other=value&foo=baz&foo=test&foo=bar');
	});

	test('multiple query params with the same key must be unique values', () => {
		const source = new URL('http://localhost/page?foo=bar&foo=baz&foo=baz');
		const target = new URL('http://localhost/page?other=value&foo=baz');

		expect([...source.searchParams.entries()].length).toEqual(3);
		expect([...target.searchParams.entries()].length).toEqual(2);

		applySearchParams(target.searchParams, source.searchParams);

		expect([...source.searchParams.entries()].length).toEqual(3);
		expect([...target.searchParams.entries()].length).toEqual(3);

		expect(target.toString()).toEqual('http://localhost/page?other=value&foo=baz&foo=bar');
	});

	test('Next.js page params (nxtP) always override', () => {
		const source = new URL('http://localhost/page?nxtPfoo=bar');
		const target = new URL('http://localhost/page?other=value&foo=baz&foo=test');

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(3);

		applySearchParams(target.searchParams, source.searchParams);

		expect([...source.searchParams.entries()].length).toEqual(1);
		expect([...target.searchParams.entries()].length).toEqual(3);

		expect(target.toString()).toEqual('http://localhost/page?other=value&foo=bar&nxtPfoo=bar');
	});
});
