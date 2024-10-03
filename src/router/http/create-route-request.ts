import { applySearchParams } from './apply-search-params';

/**
 * Creates a new Request object with the same body, headers, and search params as the original.
 *
 * Replaces the URL with the given path, stripping the `.html` extension and `/index.html` for
 * asset matching.
 * https://developers.cloudflare.com/pages/platform/serving-pages/#route-matching
 *
 * @param req Request object to re-create.
 * @param path URL to use for the new Request object.
 * @returns A new Request object with the same body and headers as the original.
 */
export const createRouteRequest = (req: Request, path: string): Request => {
	const newUrl = new URL(path, req.url);
	applySearchParams(newUrl.searchParams, new URL(req.url).searchParams);

	newUrl.pathname = newUrl.pathname.replace(/\/index.html$/, '/').replace(/\.html$/, '');

	return new Request(newUrl, req);
};
