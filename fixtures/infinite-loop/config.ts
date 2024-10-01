import type { VercelConfig } from '../../src/types';

export const config: VercelConfig = {
	version: 3,
	routes: [
		{ src: '^/invalid$', dest: '/invalid/new', status: 404 },
		{ handle: 'filesystem' },
		{ src: '^/infinite$', dest: '/infinite/new' },
		{ handle: 'miss' },
		{ src: '^/invalid/new$', dest: '/invalid', check: true },
		{ src: '^/infinite/new$', dest: '/infinite', check: true },
		{ handle: 'hit' },
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
