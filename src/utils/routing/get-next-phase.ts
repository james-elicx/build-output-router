import type { Phase } from '@/types/build-output';

/**
 * Gets the next phase of the routing process.
 *
 * Determines which phase should follow the `none`, `filesystem`, `rewrite`, or `resource` phases.
 * Falls back to `miss`.
 *
 * @param phase Current phase of the routing process.
 * @returns Next phase of the routing process.
 */
export const getNextPhase = (phase: Phase): Phase => {
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
};
