import type { Assets } from './assets';

export type Fetcher = {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type ExecutionContext = {
	waitUntil: (promise: Promise<unknown>) => void;
};

export type RequestContext = {
	request: { url: string | URL; method: string; headers: Headers };
	assets: Assets;
	ctx: ExecutionContext;
};
