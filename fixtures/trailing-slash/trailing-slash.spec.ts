import { runTestSet } from '../run-test-set';
import { config } from './config';
import { fileSystem } from './file-system';

// `trailingSlash` option in `next.config.js` is `true`.

runTestSet({
	name: 'trailing-slash',
	desc: 'trailing slash in basic app',
	config,
	fileSystem,
	cases: [
		{
			name: 'non-trailing slash redirects to trailing slash',
			paths: ['/en'],
			input: {},
			expected: {
				status: 308,
				data: '',
				headers: { location: '/en/' },
			},
		},
		{
			name: 'dynamic page with trailing slash matches',
			paths: ['/en/'],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/[lang]', params: [['lang', 'en']] }),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/[lang]',
				},
			},
		},
		{
			name: 'non-trailing slash non-dynamic page redirects to trailing slash',
			paths: ['/api/hello'],
			input: {},
			expected: {
				status: 308,
				data: '',
				headers: {
					location: '/api/hello/',
				},
			},
		},
		{
			name: 'non-dynamic page with trailing slash matches',
			paths: ['/api/hello/'],
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
			name: 'invalid page 404s',
			paths: ['/invalid/route/'],
			input: {},
			expected: {
				status: 404,
				data: '<html>404</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/404',
				},
			},
		},
		{
			name: 'non-dynamic prerendered route matches',
			paths: ['/robots.txt'],
			input: {},
			expected: {
				status: 200,
				data: 'robots.txt fallback',
				headers: {
					'content-type': 'text/plain',
					'x-matched-path': '/robots.txt',
					vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch',
				},
			},
		},
	],
});
