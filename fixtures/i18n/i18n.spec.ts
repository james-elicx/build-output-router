import { runTestSet } from '../run-test-set';
import { config } from './config';
import { fileSystem, locales, nonStaticLocales, staticLocales } from './file-system';

// next.config.js internationalization (i18n); sub-path routing, and domain routing.

runTestSet({
	name: 'i18n',
	desc: 'next.js i18n',
	config,
	fileSystem,
	cases: [
		{
			name: 'returns 404 for missing asset instead of infinite loop',
			paths: ['/favicon.ico'],
			input: {},
			expected: {
				status: 404,
				data: '<html>en: 404</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/en/404',
				},
			},
		},
		{
			name: '/ matches default locale (en) page',
			paths: ['/'],
			input: {},
			expected: {
				status: 200,
				data: '<html>en</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/en',
				},
			},
		},
		...staticLocales.map((locale) => {
			const path = `/${locale}`;
			return {
				name: `${path} matches ${path} static page for the correct locale`,
				paths: [path],
				input: {},
				expected: {
					status: 200,
					data: `<html>${locale}</html>`,
					headers: {
						'content-type': 'text/html; charset=utf-8',
						'x-matched-path': `${path}`,
					},
				},
			};
		}),
		...nonStaticLocales.map((locale) => {
			const path = `/${locale}`;
			return {
				name: `${path} matches /index function as it is not statically generated`,
				paths: [path],
				input: {},
				expected: {
					status: 200,
					data: JSON.stringify({ file: '/index', params: [] }),
					headers: {
						'content-type': 'text/plain;charset=UTF-8',
						'x-matched-path': '/',
					},
				},
			};
		}),
		...staticLocales.map((locale) => ({
			name: `gets static locale (${locale}) page for generated \`_next/data\``,
			paths: [`/_next/data/_LMNvx1uNzgkLzYi9-YVv/${locale}/gsp.json`],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ locale }),
				headers: {
					'x-matched-path': `/_next/data/_LMNvx1uNzgkLzYi9-YVv/${locale}/gsp.json`,
				},
			},
		})),
		{
			name: 'gets static file for valid `_next/static/...`',
			paths: ['/_next/static/chunks/index.js'],
			input: {
				headers: { 'accept-language': 'fr' },
			},
			expected: {
				status: 200,
				data: 'index chunk file',
				headers: {
					'cache-control': 'public,max-age=31536000,immutable',
					'x-matched-path': '/_next/static/chunks/index.js',
				},
			},
		},
		{
			name: 'runs function for route (no specific locale for function)',
			paths: ['/gssp', ...locales.map((locale) => `/${locale}/gssp`)],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({ file: '/gssp', params: [] }),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/gssp',
				},
			},
		},
		{
			name: 'runs function for dynamic route (no specific locale for function)',
			paths: ['/gsp/test', ...locales.map((locale) => `/${locale}/gsp/test`)],
			input: {},
			expected: {
				status: 200,
				data: JSON.stringify({
					file: '/gsp/[slug]',
					params: [
						['nxtPslug', 'test'],
						['slug', 'test'],
					],
				}),
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
					'x-matched-path': '/gsp/[slug]',
				},
			},
		},
		{
			name: 'locale redirects to url with accept-language (es) header',
			paths: ['/', '/en', '/fr', '/nl', '/es'],
			input: {
				headers: { 'accept-language': 'es' },
			},
			expected: {
				status: 307,
				data: '',
				headers: { location: 'https://example.es/' },
			},
		},
		{
			name: 'locale redirects to url with cookie (es)',
			paths: ['/', '/en', '/fr', '/nl', '/es'],
			input: {
				headers: { cookie: 'NEXT_LOCALE=es' },
			},
			expected: {
				status: 307,
				data: '',
				headers: { location: 'https://example.es/' },
			},
		},
		{
			name: 'locale does not redirect with same accept-language (en) header',
			paths: ['/'],
			input: {
				headers: { 'accept-language': 'en' },
			},
			expected: {
				status: 200,
				data: '<html>en</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/en',
				},
			},
		},
		{
			name: 'locale does not redirect with same cookie (en)',
			paths: ['/'],
			input: {
				headers: { cookie: 'NEXT_LOCALE=en' },
			},
			expected: {
				status: 200,
				data: '<html>en</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/en',
				},
			},
		},
		{
			name: 'locale redirects to path with accept-language (fr) header',
			paths: ['/'],
			input: {
				headers: { 'accept-language': 'fr' },
			},
			expected: {
				status: 307,
				data: '',
				headers: { location: '/fr' },
			},
		},
		{
			name: 'locale redirects to path with cookie (fr)',
			paths: ['/'],
			input: {
				headers: { cookie: 'NEXT_LOCALE=fr' },
			},
			expected: {
				status: 307,
				data: '',
				headers: { location: '/fr' },
			},
		},
		{
			name: 'does not redirect when path starts with locale',
			paths: ['/fr'],
			input: {},
			expected: {
				status: 200,
				data: '<html>fr</html>',
				headers: {
					'content-type': 'text/html; charset=utf-8',
					'x-matched-path': '/fr',
				},
			},
		},
		// TODO: Investigate if the project setup is still correct for this test with a new Next.js app -> it might be relevant still, in which case we might have a bug.
		// {
		// 	name: 'Vercel wildcard rewrites work: example.es -> /es',
		// 	paths: ['/'],
		// 	input: {
		// 		host: 'example.es',
		// 	},
		// 	expected: {
		// 		status: 200,
		// 		data: '<html>es</html>',
		// 		headers: {
		// 			'content-type': 'text/html; charset=utf-8',
		// 			'x-matched-path': '/es',
		// 		},
		// 	},
		// },
	],
});
