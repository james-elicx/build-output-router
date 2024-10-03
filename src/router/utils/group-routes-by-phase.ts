import type { Phase, Route, RoutesGroupedByPhase, SourceRoute } from '../types';
import { isHandlerRoute } from './is-handler-route';

const append = (str: string, suffix: string) => (str.endsWith(suffix) ? str : `${str}${suffix}`);
const prepend = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`);

/**
 * Given a source route it normalizes its src value if needed.
 *
 * (In this context normalization means tweaking the src value so that it follows
 * a format which Vercel expects).
 *
 * Note: this function applies the change side-effectfully to the route object.
 *
 * @param route Route which src we want to potentially normalize.
 */
const normalizeRouteSrc = (route: SourceRoute): SourceRoute => {
	if (!route.src) return route;

	// we rely on locale root routes pointing to '/' to perform runtime checks
	// so we cannot normalize such src values as that would break things later on
	// see: https://github.com/cloudflare/next-on-pages/blob/654545/packages/next-on-pages/templates/_worker.js/routes-matcher.ts#L353-L358
	if (route.locale && route.src === '/') return route;

	return {
		...route,
		// route src should always end start with `^` and end with `$`.
		// see: https://github.com/vercel/vercel/blob/ea5bc88/packages/routing-utils/src/index.ts#L77
		// see: https://github.com/vercel/vercel/blob/ea5bc88/packages/routing-utils/src/index.ts#L82
		src: append(prepend(route.src, '^'), '$'),
	};
};

/**
 * Groups the routing rules from the build output config by the phases that each route falls under.
 *
 * Defaults to `none` for rules that are not under a phase.
 *
 * @param routes Routing rules from the build output config.
 * @returns Grouped routing rules.
 */
export const groupRoutesByPhase = (routes: Route[]) => {
	const grouped: RoutesGroupedByPhase = {
		none: [],
		filesystem: [],
		miss: [],
		rewrite: [],
		resource: [],
		hit: [],
		error: [],
	};

	let currentPhase: Phase = 'none';

	for (const route of routes) {
		if (isHandlerRoute(route)) {
			currentPhase = route.handle;
		} else {
			grouped[currentPhase].push(normalizeRouteSrc(route));
		}
	}

	return grouped;
};
