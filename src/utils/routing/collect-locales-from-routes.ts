import type { Route, RoutesGroupedByPhase } from '@/types/build-output';

import { isHandlerRoute } from './is-handler-route';

/**
 * Collects all the locales present in the Vercel routes.
 *
 * @param routes The Vercel routes to collect the locales from.
 * @returns Set of found locales.
 */
export const collectLocalesFromRoutes = (routes: Route[] | RoutesGroupedByPhase): Set<string> =>
	new Set(
		(Array.isArray(routes) ? routes : Object.values(routes).flat())
			.flatMap((source) =>
				!isHandlerRoute(source) && source.locale?.redirect
					? Object.keys(source.locale.redirect)
					: [],
			)
			.filter(Boolean),
	);
