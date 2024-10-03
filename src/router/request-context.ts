export type Assets = {
	has: (path: string) => boolean;
	get: (path: string) => {
		isStaticAsset: boolean;
		isMiddleware: boolean;
		isRouteFunction: boolean;
		fetch: (data: { path: string; searchParams: URLSearchParams }) => Promise<Response>;
	} | null;
};

type ExecutionContext = {
	waitUntil: (promise: Promise<unknown>) => void;
};

export type RequestContext = {
	request: { url: string | URL; method: string; headers: Headers };
	assets: Assets;
	ctx: ExecutionContext;
};
