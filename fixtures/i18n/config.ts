import type { VercelConfig } from '../../src/types';

export const config: VercelConfig = {
	version: 3,
	routes: [
		{
			src: '^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$',
			headers: { Location: '/$1' },
			status: 308,
			continue: true,
		},
		{
			src: '/_next/__private/trace',
			dest: '/404',
			status: 404,
			continue: true,
		},
		{
			src: '^/(?!(?:_next/.*|en|fr|nl|es|de)(?:/.*|$))(.*)$',
			dest: '$wildcard/$1',
			continue: true,
		},
		{
			src: '^//?(?:en|fr|nl|es|de)?/?$',
			locale: {
				redirect: { es: 'https://example.es/' },
				cookie: 'NEXT_LOCALE',
			},
			continue: true,
		},
		{
			src: '/',
			locale: {
				redirect: { en: '/', fr: '/fr', nl: '/nl', es: '/es', de: '/de' },
				cookie: 'NEXT_LOCALE',
			},
			continue: true,
		},
		{ src: '^/$', dest: '/en', continue: true },
		{
			src: '^/(?!(?:_next/.*|en|fr|nl|es|de)(?:/.*|$))(.*)$',
			dest: '/en/$1',
			continue: true,
		},
		{
			src: '/(?:en|fr|nl|es|de)?[/]?404/?',
			status: 404,
			continue: true,
			missing: [{ type: 'header', key: 'x-prerender-revalidate' }],
		},
		{ src: '/(?:en|fr|nl|es|de)?[/]?500', status: 500, continue: true },
		{ handle: 'filesystem' },
		{ src: '/_next/data/(.*)', dest: '/_next/data/$1', check: true },
		{ handle: 'resource' },
		{ src: '/.*', status: 404 },
		{ handle: 'miss' },
		{
			src: '/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+',
			status: 404,
			check: true,
			dest: '$0',
		},
		{ src: '/en', dest: '/', check: true },
		{ src: '^//?(?:en|fr|nl|es|de)/(.*)', dest: '/$1', check: true },
		{ handle: 'rewrite' },
		{
			src: '^/_next/data/_LMNvx1uNzgkLzYi9\\-YVv/(?<nextLocale>en|fr|nl|es|de)/gsp.json$',
			dest: '/$nextLocale/gsp',
		},
		{
			src: '^/_next/data/_LMNvx1uNzgkLzYi9\\-YVv/(?<nextLocale>en|fr|nl|es|de)/gsp/(?<nxtPslug>[^/]+?)\\.json$',
			dest: '/$nextLocale/gsp/[slug]?nxtPslug=$nxtPslug',
		},
		{
			src: '^/_next/data/_LMNvx1uNzgkLzYi9\\-YVv/(?<nextLocale>en|fr|nl|es|de)/gssp.json$',
			dest: '/$nextLocale/gssp',
		},
		{ src: '/_next/data/(.*)', dest: '/404', status: 404 },
		{
			src: '^[/]?(?<nextLocale>en|fr|nl|es|de)?/gsp/(?<nxtPslug>[^/]+?)(?:/)?$',
			dest: '/$nextLocale/gsp/[slug]?nxtPslug=$nxtPslug',
		},
		{ handle: 'hit' },
		{
			src: '/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|_LMNvx1uNzgkLzYi9\\-YVv)/.+',
			headers: { 'cache-control': 'public,max-age=31536000,immutable' },
			continue: true,
			important: true,
		},
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
		{
			src: '/(?<nextLocale>en|fr|nl|es|de)(/.*|$)',
			dest: '/$nextLocale/404',
			status: 404,
			caseSensitive: true,
		},
		{ src: '/.*', dest: '/en/404', status: 404 },
		{
			src: '/(?<nextLocale>en|fr|nl|es|de)(/.*|$)',
			dest: '/$nextLocale/500',
			status: 500,
			caseSensitive: true,
		},
		{ src: '/.*', dest: '/en/500', status: 500 },
	],
	wildcard: [{ domain: 'example.es', value: '/es' }],
	overrides: {
		'en/gsp.html': { path: 'en/gsp', contentType: 'text/html; charset=utf-8' },
		'fr/gsp.html': { path: 'fr/gsp', contentType: 'text/html; charset=utf-8' },
		'nl/gsp.html': { path: 'nl/gsp', contentType: 'text/html; charset=utf-8' },
		'en.html': { path: 'en', contentType: 'text/html; charset=utf-8' },
		'en/404.html': { path: 'en/404', contentType: 'text/html; charset=utf-8' },
		'en/500.html': { path: 'en/500', contentType: 'text/html; charset=utf-8' },
		'fr.html': { path: 'fr', contentType: 'text/html; charset=utf-8' },
		'fr/404.html': { path: 'fr/404', contentType: 'text/html; charset=utf-8' },
		'fr/500.html': { path: 'fr/500', contentType: 'text/html; charset=utf-8' },
		'nl.html': { path: 'nl', contentType: 'text/html; charset=utf-8' },
		'nl/404.html': { path: 'nl/404', contentType: 'text/html; charset=utf-8' },
		'nl/500.html': { path: 'nl/500', contentType: 'text/html; charset=utf-8' },
		'es.html': { path: 'es', contentType: 'text/html; charset=utf-8' },
		'es/404.html': { path: 'es/404', contentType: 'text/html; charset=utf-8' },
		'es/500.html': { path: 'es/500', contentType: 'text/html; charset=utf-8' },
		'de/404.html': { path: 'de/404', contentType: 'text/html; charset=utf-8' },
		'de/500.html': { path: 'de/500', contentType: 'text/html; charset=utf-8' },
	},
};
