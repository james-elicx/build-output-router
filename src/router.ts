import { RoutesMatcher } from './routes-matcher';
import type { ConfigMetadata, RequestContext, RoutesGroupedByPhase } from './types';
import type { RoutingMatch } from './utils';
import { applyHeaders, applySearchParams, isUrl } from './utils';

export class Router {
	constructor(
		private routes: RoutesGroupedByPhase,
		private configMetadata: ConfigMetadata,
	) {}

	public fetch = async (ctx: RequestContext) => {
		const matcher = new RoutesMatcher(this.routes, ctx, this.configMetadata);
		const match = await this.findMatch(matcher);

		return this.generateResponse(ctx, match);
	};

	/**
	 * Finds a match for the request.
	 *
	 * @param matcher Instance of the matcher for the request.
	 * @param phase The phase to run, either `none` or `error`.
	 * @param skipErrorMatch Whether to skip the error match.
	 * @returns The matched set of path, status, headers, and search params.
	 */
	private findMatch = async (
		matcher: RoutesMatcher,
		phase: 'none' | 'error' = 'none',
		skipErrorMatch = false,
	): Promise<RoutingMatch> => {
		const result = await matcher.run(phase);

		if (result === 'error' || (!skipErrorMatch && matcher.status && matcher.status >= 400)) {
			return this.findMatch(matcher, 'error', true);
		}

		return {
			path: matcher.path,
			status: matcher.status,
			headers: matcher.headers,
			searchParams: matcher.searchParams,
			body: matcher.body,
		};
	};

	/**
	 * Serves a file from the Vercel build output.
	 *
	 * @param reqCtx Request Context object.
	 * @param match The match from the Vercel build output.
	 * @returns A response object.
	 */
	// eslint-disable-next-line class-methods-use-this
	private generateResponse = async (
		{ request, assets }: RequestContext,
		{ path = '/404', status, headers, searchParams, body }: RoutingMatch,
	): Promise<Response> => {
		// Redirect user to external URL for redirects.
		const locationHeader = headers.normal.get('location');
		if (locationHeader) {
			// Apply the search params to the location header if it was not from middleware.
			// Middleware that returns a redirect will specify the destination, including any search params
			// that they want to include. Therefore, we should not be appending search params to those.
			if (locationHeader !== headers.middlewareLocation) {
				const paramsStr = [...searchParams.keys()].length ? `?${searchParams.toString()}` : '';
				headers.normal.set('location', `${locationHeader ?? '/'}${paramsStr}`);
			}

			return new Response(null, { status, headers: headers.normal });
		}

		let resp: Response;

		if (body !== undefined) {
			// If we have a response body from matching, use it instead.
			resp = new Response(body, { status });
		} else if (isUrl(path)) {
			// If the path is an URL from matching, that means it was rewritten to a full URL.
			const url = new URL(path);
			applySearchParams(url.searchParams, searchParams);
			resp = await fetch(url, request);
		} else {
			// Otherwise, we need to serve a file from the Vercel build output.
			resp =
				(await assets.get(path)?.fetch({ path, searchParams })) ??
				new Response('Not Found', { status: 404 });
		}

		const newHeaders = headers.normal;
		applyHeaders(newHeaders, resp.headers);
		applyHeaders(newHeaders, headers.important);

		resp = new Response(resp.body, {
			...resp,
			status: status || resp.status,
			headers: newHeaders,
		});

		return resp;
	};
}
