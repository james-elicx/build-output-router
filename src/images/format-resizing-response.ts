import { applyHeaders, createMutableResponse } from '@/router/http';

import type { ImagesConfig } from './types';

/**
 * Formats the given response to match the images configuration spec from the build output
 * config.
 *
 * Applies headers for `Content-Security-Policy` and `Content-Disposition`, if defined in the config.
 *
 * https://vercel.com/docs/build-output-api/v3/configuration#images
 *
 * @param resp Response to format.
 * @param imageUrl Image URL that was resized.
 * @param config Images configuration from the build output.
 * @returns Formatted response.
 */
export const formatResizingResponse = (
	resp: Response,
	imageUrl: URL,
	config?: ImagesConfig,
): Response => {
	const newHeaders = new Headers();

	if (config?.contentSecurityPolicy) {
		newHeaders.set('Content-Security-Policy', config.contentSecurityPolicy);
	}

	if (config?.contentDispositionType) {
		const fileName = imageUrl.pathname.split('/').pop();
		const contentDisposition = fileName
			? `${config.contentDispositionType}; filename="${fileName}"`
			: config.contentDispositionType;

		newHeaders.set('Content-Disposition', contentDisposition);
	}

	if (!resp.headers.has('Cache-Control')) {
		// Fall back to the minimumCacheTTL value if there is no Cache-Control header.
		// https://vercel.com/docs/concepts/image-optimization#caching
		newHeaders.set('Cache-Control', `public, max-age=${config?.minimumCacheTTL ?? 60}`);
	}

	const mutableResponse = createMutableResponse(resp);
	applyHeaders(mutableResponse.headers, newHeaders);

	return mutableResponse;
};
