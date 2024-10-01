import { runTestSet } from '../run-test-set';
import { config } from './config';
import { fileSystem } from './file-system';

// root-level catch-all, and dynamic route.

runTestSet({
	name: 'check-route-match',
	desc: 'basic edge runtime app dir routes',
	config,
	fileSystem,
	cases: [
		{
			name: 'matches a route with only `src`',
			paths: ['/valid-src-only'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: "doesn't match a route with invalid `src`",
			paths: ['/invalid-src-only'],
			input: {},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: { 'content-type': 'text/html; charset=utf-8' },
			},
		},
		{
			name: 'matches a route with `src` and single `has`',
			paths: ['/valid-src-and-has'],

			input: {
				host: 'test.com',
			},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: 'matches a route with `src` and multiple `has`',
			paths: ['/valid-src-and-multiple-has?queryWithValue=value'],
			input: {
				host: 'test.com',
				headers: { headerWithoutValue: '' },
			},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/index',
					params: [['queryWithValue', 'value']],
				}),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: 'matches a route with `src` and `missing`',
			paths: ['/valid-src-and-missing'],
			input: {
				host: 'test.com',
			},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: "doesn't match a route with `src` and invalid `missing`",
			paths: ['/valid-src-and-missing'],
			input: {
				host: 'example.com',
			},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: { 'content-type': 'text/html; charset=utf-8' },
			},
		},
		{
			name: 'match with `src` and multiple `missing`',
			paths: ['/valid-src-and-multiple-missing'],
			input: {
				host: 'test.com',
			},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: "doesn't match with `src` and multiple `missing` (one valid, one invalid)",
			paths: ['/valid-src-and-missing?queryWithValue=value'],
			input: {
				host: 'example.com',
			},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: { 'content-type': 'text/html; charset=utf-8' },
			},
		},
		{
			name: 'match with `src` and `has` and `missing`',
			paths: ['/valid-src-and-has-and-missing'],
			input: {
				host: 'test.com',
			},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: 'match with `src` + `has` + `missing` + `methods`',
			paths: ['/valid-src-and-has-and-missing-and-methods'],
			input: {
				host: 'test.com',
			},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: 'match with correct `method`',
			paths: ['/valid-src-and-method'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/index', params: [] }),
				headers: { 'content-type': 'text/plain;charset=UTF-8' },
			},
		},
		{
			name: "doesn't match with incorrect `method`",
			paths: ['/valid-src-and-method'],
			input: {
				method: 'POST',
			},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: { 'content-type': 'text/html; charset=utf-8' },
			},
		},
	],
});
