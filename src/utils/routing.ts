import type { Phase } from '../types';

export type RoutingMatch = {
	path: string;
	status: number | undefined;
	headers: {
		/**
		 * The headers present on a source route.
		 * Gets applied to the final response before the response headers from running a function.
		 */
		normal: Headers;
		/**
		 * The *important* headers - the ones present on a source route that specifies `important: true`.
		 * Gets applied to the final response after the response headers from running a function.
		 */
		important: Headers;
		/**
		 * Tracks if a location header is found, and what the value is, after running a middleware function.
		 */
		middlewareLocation?: string | null;
	};
	searchParams: URLSearchParams;
	body: BodyInit | undefined | null;
};

/**
 * Gets the next phase of the routing process.
 *
 * Determines which phase should follow the `none`, `filesystem`, `rewrite`, or `resource` phases.
 * Falls back to `miss`.
 *
 * @param phase Current phase of the routing process.
 * @returns Next phase of the routing process.
 */
export function getNextPhase(phase: Phase): Phase {
	switch (phase) {
		// `none` applied headers/redirects/middleware/`beforeFiles` rewrites. It checked non-dynamic routes and static assets.
		case 'none':
			return 'filesystem';
		// `filesystem` applied `afterFiles` rewrites. It checked those rewritten routes.
		case 'filesystem':
			return 'rewrite';
		// `rewrite` applied dynamic params to requests. It checked dynamic routes.
		case 'rewrite':
			return 'resource';
		// `resource` applied `fallback` rewrites. It checked the final routes.
		case 'resource':
		default:
			return 'miss';
	}
}

/**
 * Checks if a source route's matcher uses the regex format for locales with a trailing slash, where
 * the locales specified are known.
 *
 * Determines whether a matcher is in the format of `^//?(?:en|fr|nl)/(.*)$`.
 *
 * @param src Source route `src` regex value.
 * @param locales Known available locales.
 * @returns Whether the source route matches the regex for a locale with a trailing slash.
 */
export function isLocaleTrailingSlashRegex(src: string, locales: Set<string>) {
	const prefix = '^//?(?:';
	const suffix = ')/(.*)$';

	if (!src.startsWith(prefix) || !src.endsWith(suffix)) {
		return false;
	}

	const foundLocales = src.slice(prefix.length, -suffix.length).split('|');
	return foundLocales.every((locale) => locales.has(locale));
}
