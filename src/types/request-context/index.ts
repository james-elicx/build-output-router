import type { ExecutionContext } from '@/types/build-output';

export type Assets = {
	has: (path: string) => boolean;
	get: (path: string) => {
		kind: 'static' | 'middleware' | 'function';
		fetch: (data: { path: string; searchParams: URLSearchParams }) => Promise<Response>;
	} | null;
};

export type Fetcher = {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type RequestContext = {
	request: { url: string | URL; method: string; headers: Headers };
	assets: Assets;
	ctx: ExecutionContext;
};
