import { isRemotePatternMatch } from './is-remote-pattern-match';
import type { ImageFormatWithoutPrefix, ImagesConfig } from './types';

export type ResizingProperties = {
	isRelative: boolean;
	imageUrl: URL;
	options: { width: number; quality: number; format: string | undefined };
};

/**
 * Derives the properties to use for image resizing from the incoming request, respecting the
 * images configuration spec from the  build output config.
 *
 * https://vercel.com/docs/build-output-api/v3/configuration#images
 *
 * @param request Incoming request.
 * @param config Images configuration from the build output.
 * @returns Resizing properties if the request is valid, otherwise undefined.
 */
export const getResizingProperties = (
	request: Request,
	config?: ImagesConfig,
): ResizingProperties | undefined => {
	if (request.method !== 'GET') return undefined;

	const { origin, searchParams } = new URL(request.url);

	const rawUrl = searchParams.get('url');
	const width = Number.parseInt(searchParams.get('w') ?? '', 10);
	// 75 is the default quality - https://nextjs.org/docs/app/api-reference/components/image#quality
	const quality = Number.parseInt(searchParams.get('q') ?? '75', 10);

	if (!rawUrl || Number.isNaN(width) || Number.isNaN(quality)) return undefined;
	if (!config?.sizes?.includes(width)) return undefined;
	if (quality < 0 || quality > 100) return undefined;

	const url = new URL(rawUrl, origin);

	// SVGs must be allowed by the config.
	if (url.pathname.endsWith('.svg') && !config?.dangerouslyAllowSVG) {
		return undefined;
	}

	const isProtocolRelative = rawUrl.startsWith('//');
	const isRelative = rawUrl.startsWith('/') && !isProtocolRelative;

	if (
		// Relative URL means same origin as deployment and is allowed.
		!isRelative &&
		// External image URL must be allowed by domains or remote patterns.
		!config?.domains?.includes(url.hostname) &&
		!config?.remotePatterns?.find((pattern) => isRemotePatternMatch(url, pattern))
	) {
		return undefined;
	}

	const acceptHeader = request.headers.get('Accept') ?? '';
	const format = config?.formats?.find((f) => acceptHeader.includes(f))?.replace('image/', '') as
		| ImageFormatWithoutPrefix
		| undefined;

	return {
		isRelative,
		imageUrl: url,
		options: { width, quality, format },
	};
};
