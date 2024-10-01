import type { VercelConfig } from '@/types/vercel-config';

export const config: VercelConfig = {
	version: 3,
	routes: [
		{
			src: '^/((?!_next/)(?:.*[^/]|.*))/?$',
			has: [{ type: 'header', key: 'x-nextjs-data' }],
			dest: '/_next/data/iJgI1dhNzKWmpXhfhPItf/$1.json',
			continue: true,
			override: true,
		},
		{
			src: '^/redirect/(?<paramWithValue>[^/]+?)/param(?:/)?$',
			headers: {
				location: '/redirect/with/param?paramWithValue=$paramWithValue',
			},
		},
		{ handle: 'rewrite' },
		{
			src: '^/_next/data/iJgI1dhNzKWmpXhfhPItf/dynamic/(?<pageId>[^/]+?)(?:/)?.json$',
			dest: '/dynamic/[pageId]?pageId=$pageId',
		},
		{
			src: '^/dynamic/(?<pageId>[^/]+?)(?:/)?$',
			dest: '/dynamic/[pageId]?pageId=$pageId',
		},
		{
			src: '^(?:/(?<nextParamIndex>.+?))?(?:/)?$',
			dest: '/[[...index]]?nextParamIndex=$nextParamIndex',
		},
		{ handle: 'resource' },
		{ src: '/.*', status: 404 },
		{ handle: 'hit' },
		{
			src: '/index',
			headers: {
				'x-matched-path': '/',
			},
			continue: true,
			important: true,
		},
		{
			src: '/((?!index$).*)',
			headers: {
				'x-matched-path': '/$1',
			},
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
