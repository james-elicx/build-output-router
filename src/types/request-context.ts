export type Fetcher = {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type ExecutionContext = {
	waitUntil: (promise: Promise<unknown>) => void;
};

export type RequestContext = {
	request: Request;
	assetsFetcher: Fetcher;
	ctx: ExecutionContext;
};
