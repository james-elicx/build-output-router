import type { VercelConfig } from '../../src/types';

export const config: VercelConfig = {
	version: 3,
	routes: [
		{ src: '^/valid-src-only$', dest: '/' },
		{
			src: '^/valid-src-and-has$',
			dest: '/',
			has: [{ type: 'host', value: 'test.com' }],
		},
		{
			src: '^/valid-src-and-multiple-has$',
			dest: '/',
			has: [
				{ type: 'host', value: 'test.com' },
				{ type: 'header', key: 'headerWithoutValue' },
				{ type: 'query', key: 'queryWithValue', value: 'value' },
			],
		},
		{
			src: '^/valid-src-and-missing$',
			dest: '/',
			missing: [{ type: 'host', value: 'example.com' }],
		},
		{
			src: '^/valid-src-and-multiple-missing$',
			dest: '/',
			missing: [
				{ type: 'host', value: 'example.com' },
				{ type: 'query', key: 'queryWithValue' },
			],
		},
		{
			src: '^/valid-src-and-has-and-missing$',
			dest: '/',
			has: [{ type: 'host', value: 'test.com' }],
			missing: [{ type: 'host', value: 'example.com' }],
		},
		{
			src: '^/valid-src-and-has-and-missing-and-methods$',
			dest: '/',
			has: [{ type: 'host', value: 'test.com' }],
			missing: [{ type: 'query', key: 'missingQuery' }],
			methods: ['GET'],
		},
		{
			src: '^/valid-src-and-method$',
			dest: '/',
			methods: ['GET'],
		},
		{ handle: 'miss' },
		{ src: '.*', dest: '/404', status: 404 },
	],
	overrides: {
		'404.html': { path: '404', contentType: 'text/html; charset=utf-8' },
		'500.html': { path: '500', contentType: 'text/html; charset=utf-8' },
	},
};
