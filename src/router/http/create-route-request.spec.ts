import { expect, suite, test } from 'vitest';

import { createRouteRequest } from './create-route-request';

suite('createRouteRequest', () => {
	test('creates new request with the new path', () => {
		const prevReq = new Request('http://localhost/test');
		const request = createRouteRequest(prevReq, '/new-path');

		expect(new URL(request.url).pathname).toEqual('/new-path');
	});

	test('creates new request with the new path without .html', () => {
		const prevReq = new Request('http://localhost/test');
		const request = createRouteRequest(prevReq, '/new-path.html');

		expect(new URL(request.url).pathname).toEqual('/new-path');
	});

	test('creates new request with the new path without .html', () => {
		const prevReq = new Request('http://localhost/test');
		const request = createRouteRequest(prevReq, '/index.html');

		expect(new URL(request.url).pathname).toEqual('/');
	});
});
