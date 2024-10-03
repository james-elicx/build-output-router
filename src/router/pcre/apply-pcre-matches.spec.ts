import { expect, suite, test } from 'vitest';

import type { SourceRoute } from '../types';
import { applyPCREMatches } from './apply-pcre-matches';
import { matchPCRE } from './match-pcre';

type TestCase = {
	name: string;
	url: string;
	route: SourceRoute;
	opts?: { namedOnly?: boolean };
	expected: { match: boolean; captureGroupKeys: string[]; newDest?: string };
};

suite('applyPCREMatches', () => {
	const testCases: TestCase[] = [
		{
			name: 'should process a dest for a basic route',
			url: 'https://example.com/index',
			route: { src: '^/index(?:/)?', dest: '/index.html' },
			expected: { match: true, captureGroupKeys: [], newDest: '/index.html' },
		},
		{
			name: 'should process a `$0` dest for a basic route',
			url: 'https://example.com/index',
			route: { src: '^/index(?:/)?', dest: '/new/$0/dest' },
			expected: {
				match: true,
				captureGroupKeys: [],
				newDest: '/new//index/dest',
			},
		},
		{
			name: 'should process a `$1` dest for a basic route',
			url: 'https://example.com/index',
			route: { src: '^/i(nde)x(?:/)?', dest: '/new/$1/dest' },
			expected: { match: true, captureGroupKeys: [], newDest: '/new/nde/dest' },
		},
		{
			name: 'should process dest for a route with named groups',
			url: 'https://example.com/index',
			route: { src: '^/i(?<name>nde)x(?:/)?', dest: '/new/$name/dest' },
			expected: {
				match: true,
				captureGroupKeys: ['name'],
				newDest: '/new/nde/dest',
			},
		},
		{
			name: 'should process dest for a route with multiple named groups',
			url: 'https://example.com/index/123',
			route: {
				src: '^/i(?<name>nde)x/(?<id>\\d+)(?:/)?',
				dest: '/new/$name/$id/dest',
			},
			expected: {
				match: true,
				captureGroupKeys: ['name', 'id'],
				newDest: '/new/nde/123/dest',
			},
		},
		{
			name: 'should process dest for route with named groups to query params',
			url: 'https://example.com/index/123',
			route: {
				src: '^/i(?<name>nde)x/(?<id>\\d+)(?:/)?',
				dest: '/new/$name/dest?id=$id',
			},
			expected: {
				match: true,
				captureGroupKeys: ['name', 'id'],
				newDest: '/new/nde/dest?id=123',
			},
		},
		{
			name: 'should process dest for route with missing query param in dest',
			url: 'https://example.com/index',
			route: { src: '^/i(?<name>nde)x(?:/)?', dest: '/new/$name/dest?id=$id' },
			expected: {
				match: true,
				captureGroupKeys: ['name'],
				newDest: '/new/nde/dest?id=',
			},
		},
		{
			name: 'should only apply matched named capture groups when `namedOnly` is set',
			url: 'https://example.com/index',
			route: { src: '^/i(?<name>nde)x(?:/)?', dest: '/new/$name/$dest?id=$id' },
			opts: { namedOnly: true },
			expected: {
				match: true,
				captureGroupKeys: ['name'],
				newDest: '/new/nde/$dest?id=$id',
			},
		},
		{
			name: 'should process dest for a route with named group containing underscore',
			url: 'https://example.com/index',
			route: { src: '^/i(?<na_me>nde)x(?:/)?', dest: '/new/$na_me/dest' },
			expected: {
				match: true,
				captureGroupKeys: ['na_me'],
				newDest: '/new/nde/dest',
			},
		},
	];

	testCases.forEach((testCase) => {
		test(testCase.name, () => {
			const { match, captureGroupKeys } = matchPCRE(
				testCase.route.src,
				new URL(testCase.url).pathname,
				testCase.route.caseSensitive,
			);
			const result = applyPCREMatches(
				testCase.route.dest ?? '',
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				match!,
				captureGroupKeys,
				testCase.opts,
			);

			const { newDest: expectedNewDest, ...expected } = testCase.expected;
			expect({ captureGroupKeys, match: !!match }).toEqual(expected);
			expect(result).toEqual(expectedNewDest);
		});
	});
});
