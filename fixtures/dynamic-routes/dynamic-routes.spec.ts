import { runTestSet } from '../run-test-set';
import { config } from './config';
import { fileSystem } from './file-system';

// root-level catch-all, and dynamic route.

runTestSet({
	name: 'dynamic-routes',
	desc: 'dynamic routes',
	config,
	fileSystem,
	cases: [
		{
			name: 'does not catch defined routes (`/api/hello`)',
			paths: ['/api/hello'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/api/hello', params: [] }),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/api/hello',
				},
			},
		},
		{
			name: 'catches non-defined routes in defined folder',
			paths: ['/api/test'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/[[...index]]',
					params: [['nextParamIndex', 'api/test']],
				}),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/[[...index]]',
				},
			},
		},
		{
			name: 'catches non-defined routes',
			paths: ['/test'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/[[...index]]',
					params: [['nextParamIndex', 'test']],
				}),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/[[...index]]',
				},
			},
		},
		{
			name: 'non-catchall dynamic route (`/dynamic/[pageId]`)',
			paths: ['/dynamic/test'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/dynamic/[pageId]',
					params: [['pageId', 'test']],
				}),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/dynamic/[pageId]',
				},
			},
		},
		{
			name: 'non-catchall dynamic route matched with `x-nextjs-data` header (`/dynamic/[pageId]`)',
			paths: ['/dynamic/test'],
			input: {
				headers: { 'x-nextjs-data': 'test' },
			},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/dynamic/[pageId]',
					params: [['pageId', 'test']],
				}),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/dynamic/[pageId]',
				},
			},
		},
		{
			name: 'redirects include search params from match',
			paths: ['/redirect/value/param'],
			input: {},
			expected: {
				status: 307,
				data: '',
				headers: { location: '/redirect/with/param?paramWithValue=value' },
			},
		},
	],
});
