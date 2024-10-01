import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, suite, test, vi } from 'vitest';

import type { BuildOutputItem, EdgeFunction, ExecutionContext } from '@/types/build-output';
import type { Assets, Fetcher } from '@/types/request-context';
import type { VercelConfig } from '@/types/vercel-config';
import { applyHeaders, applySearchParams, createRouteRequest } from '@/utils/http';
import { collectLocalesFromRoutes, groupRoutesByPhase } from '@/utils/routing';

import { Router } from '../src';

type TestCase = {
	name: string;
	paths: string[];
	input: {
		host?: string;
		headers?: Record<string, string>;
		method?: string;
	};
	expected: {
		status: number;
		data: string | RegExp;
		headers?: Record<string, string>;
		ignoreHeaders?: boolean;
		reqHeaders?: Record<string, string>;
		mockConsole?: {
			error: string[];
		};
	};
};

export const staticAsset = (path: string, headers = {}) => ({
	[path]: {
		type: 'static' as const,
		headers,
	},
});
export const htmlAsset = (path: string) =>
	[path, `${path}.html`].reduce(
		(acc, p) => ({
			...acc,
			[p]: {
				...staticAsset(p, { 'content-type': 'text/html; charset=utf-8' })[p],
				path: `${path}.html`,
			},
		}),
		{},
	);
export const functionAsset = (path: string) =>
	[path, ...(path.endsWith('/index') ? [path.replace('/index', '/')] : [])].reduce(
		(acc, p) => ({
			...acc,
			[p]: {
				type: 'function' as const,
				entrypoint: `functions${path}.func.js`,
			},
		}),
		{},
	);

export const runTestSet = (ctx: {
	name: string;
	desc: string;
	config: VercelConfig;
	fileSystem: Record<string, BuildOutputItem>;
	cases: TestCase[];
}) => {
	const routes = groupRoutesByPhase(ctx.config.routes ?? []);

	const router = new Router(routes, {
		locales: collectLocalesFromRoutes(routes),
		wildcardConfig: ctx.config.wildcard,
	});

	const outputDir = join(__dirname, ctx.name, 'output');

	const executionContext: ExecutionContext = {
		waitUntil: () => null,
	};

	const assetsFetcher: Fetcher = {
		fetch: (input: RequestInfo | URL) => {
			const url = new URL(input instanceof Request ? input.url : input);
			const path = join(outputDir, url.pathname);

			try {
				return Promise.resolve(new Response(readFileSync(path)));
			} catch (e) {
				return Promise.resolve(new Response(readFileSync(`${path}.html`)));
			}
		},
	};

	suite(ctx.desc, () => {
		for (const testCase of ctx.cases) {
			test(testCase.name, async () => {
				const {
					paths,
					input: { headers, host = 'localhost', method = 'GET' },
					expected,
				} = testCase;

				const urls = paths.map((p) => `http://${host}${p}`);
				for (const url of urls) {
					const request = new Request(url, { method, headers });
					const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

					const assets: Assets = {
						has: (p) => p in ctx.fileSystem,
						get: (p) => {
							const entry = ctx.fileSystem[p];
							if (!entry) return null;

							return {
								kind: entry.type,
								fetch: async ({ path, searchParams }) => {
									let resp: Response | undefined;

									const urlObj = new URL(request.url);
									applySearchParams(urlObj.searchParams, searchParams);
									const req = new Request(urlObj, request);

									switch (entry.type) {
										case 'function':
										case 'middleware': {
											const edgeFuncJs = readFileSync(join(outputDir, entry.entrypoint)).toString();
											// eslint-disable-next-line no-eval
											const edgeFunction: EdgeFunction = eval(edgeFuncJs.toString());
											resp = await edgeFunction.default(req, executionContext);
											break;
										}
										case 'static': {
											resp = await assetsFetcher.fetch(createRouteRequest(req, entry.path ?? path));
											if (entry.headers) {
												resp = new Response(resp.body, resp);
												applyHeaders(resp.headers, entry.headers);
											}
											break;
										}
										default: {
											throw new Error();
										}
									}

									return resp;
								},
							};
						},
					};

					const res = await router.fetch({ request, assets, ctx: executionContext });

					expect(res.status).toEqual(expected.status);
					const textContent = await res.text();
					if (expected.data instanceof RegExp) {
						expect(textContent).toMatch(expected.data);
					} else {
						expect(textContent).toEqual(expected.data);
					}
					if (!expected.ignoreHeaders) {
						expect(Object.fromEntries(res.headers.entries())).toEqual(expected.headers || {});
					}
					if (expected.reqHeaders) {
						expect(Object.fromEntries(request.headers.entries())).toEqual(expected.reqHeaders);
					}
					expect(consoleErrorSpy).toHaveBeenCalledTimes(expected.mockConsole?.error?.length ?? 0);
					expected.mockConsole?.error.forEach((err) =>
						expect(consoleErrorSpy).toHaveBeenCalledWith(err),
					);
				}
			});
		}
	});
};
