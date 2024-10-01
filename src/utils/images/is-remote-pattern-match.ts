import type { RemotePattern } from '@/types/images';

/**
 * Checks whether the given URL matches the given remote pattern from the build output images
 * configuration.
 *
 * https://vercel.com/docs/build-output-api/v3/configuration#images
 *
 * @param url URL to check.
 * @param pattern Remote pattern to match against.
 * @returns Whether the URL matches the remote pattern.
 */
export const isRemotePatternMatch = (
	url: URL,
	{ protocol, hostname, port, pathname }: RemotePattern,
): boolean => {
	// Protocol must match if defined.
	if (protocol && url.protocol.replace(/:$/, '') !== protocol) return false;
	// Hostname must match regexp.
	if (!new RegExp(hostname).test(url.hostname)) return false;
	// Port must match regexp if defined.
	if (port && !new RegExp(port).test(url.port)) return false;
	// Pathname must match regexp if defined.
	if (pathname && !new RegExp(pathname).test(url.pathname)) return false;
	// All checks passed.
	return true;
};
