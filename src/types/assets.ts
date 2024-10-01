export type Assets = {
	has: (path: string) => boolean;
	get: (path: string) => {
		kind: 'static' | 'middleware' | 'function';
		fetch: (data: { path: string; searchParams: URLSearchParams }) => Promise<Response>;
	} | null;
};
