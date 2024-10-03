import type { Config } from '@/router';

export const config: Config = {
	version: 3,
	routes: [
		{
			src: '^(?:/((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/]+\\.\\w+))/$',
			headers: { Location: '/$1' },
			status: 308,
			missing: [{ type: 'header', key: 'x-nextjs-data' }],
			continue: true,
		},
		{
			src: '^(?:/((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/\\.]+))$',
			headers: { Location: '/$1/' },
			status: 308,
			continue: true,
		},
		{
			src: '/404/?',
			status: 404,
			continue: true,
			missing: [{ type: 'header', key: 'x-prerender-revalidate' }],
		},
		{ src: '/500', status: 500, continue: true },
		{ handle: 'resource' },
		{ src: '/.*', status: 404 },
		{ handle: 'rewrite' },
		{ src: '^/(?<lang>[^/]+?)(?:/)?$', dest: '/[lang]?lang=$lang' },
		{ handle: 'hit' },
		{
			src: '/index',
			headers: { 'x-matched-path': '/' },
			continue: true,
			important: true,
		},
		{
			src: '/((?!index$).*)',
			headers: { 'x-matched-path': '/$1' },
			continue: true,
			important: true,
		},
		{ handle: 'error' },
		{ src: '/.*', dest: '/404', status: 404 },
		{ src: '/.*', dest: '/500', status: 500 },
	],
	overrides: {
		'404.html': { path: '404', contentType: 'text/html; charset=utf-8' },
		'500.html': { path: '500', contentType: 'text/html; charset=utf-8' },
	},
};
