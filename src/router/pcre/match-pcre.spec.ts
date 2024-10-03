import { expect, suite, test } from 'vitest';

import type { SourceRoute } from '../types';
import { matchPCRE } from './match-pcre';

type TestCase = {
	name: string;
	url: string;
	route: SourceRoute;
	opts?: { namedOnly?: boolean };
	expected: { match: boolean; captureGroupKeys: string[]; newDest?: string };
};

suite('matchPCRE', () => {
	const testCases: TestCase[] = [
		{
			name: 'should match a basic route',
			url: 'https://example.com/index',
			route: { src: '^/index(?:/)?' },
			expected: { match: true, captureGroupKeys: [] },
		},
		{
			name: 'should not match with invalid case sensitive route',
			url: 'https://example.com/INDEX',
			route: { src: '^/index(?:/)?', caseSensitive: true },
			expected: { match: false, captureGroupKeys: [] },
		},
		{
			name: 'should match with valid case sensitive route',
			url: 'https://example.com/INDEX',
			route: { src: '^/INDEX(?:/)?', caseSensitive: true },
			expected: { match: true, captureGroupKeys: [] },
		},
		{
			name: 'should match when case sensitive is not set',
			url: 'https://example.com/index',
			route: { src: '^/INDEX(?:/)?' },
			expected: { match: true, captureGroupKeys: [] },
		},
		{
			name: 'should match with named capture groups',
			url: 'https://example.com/index',
			route: { src: '^/i(?<name>nde)x(?:/)?' },
			expected: { match: true, captureGroupKeys: ['name'] },
		},
	];

	testCases.forEach((testCase) => {
		test(testCase.name, () => {
			const result = matchPCRE(
				testCase.route.src,
				new URL(testCase.url).pathname,
				testCase.route.caseSensitive,
			);
			expect({ ...result, match: !!result.match }).toEqual(testCase.expected);
		});
	});
});
