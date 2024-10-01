import type { HandlerRoute, Route } from '@/types/build-output';

/**
 * Determine whether a route is a source route or a handler.
 *
 * @param route Route to check.
 * @returns Whether the route is a handler.
 */
export const isHandlerRoute = (route: Route): route is HandlerRoute => 'handle' in route;
