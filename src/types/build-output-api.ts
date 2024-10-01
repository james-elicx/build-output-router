/**
 * Types for the Vercel build output configuration file.
 */

import type { ExecutionContext } from './request-context';

export type VercelConfig = {
	version: 3;
	routes?: VercelRoute[];
	images?: VercelImagesConfig;
	wildcard?: VercelWildcardConfig;
	overrides?: VercelOverrideConfig;
	framework?: { version: string };
	cache?: string[];
	crons?: VercelCronsConfig;
};

export type VercelRoute = VercelSource | VercelHandler;

export type VercelSource = {
	src: string;
	dest?: string;
	headers?: Record<string, string>;
	methods?: string[];
	continue?: boolean;
	override?: boolean;
	important?: boolean;
	caseSensitive?: boolean;
	check?: boolean;
	status?: number;
	has?: VercelHasFields;
	missing?: VercelHasFields;
	locale?: VercelLocale;
	middlewarePath?: string;
	middlewareRawSrc?: string[];
};

export type VercelHasField =
	| VercelHostHasField
	| VercelHeaderHasField
	| VercelCookieHasField
	| VercelQueryHasField;

export type VercelHasFields = Array<VercelHasField>;

export type VercelLocale = {
	redirect?: Record<string, string>;
	cookie?: string;
};

export type VercelHostHasField = {
	type: 'host';
	value: string;
};

export type VercelHeaderHasField = {
	type: 'header';
	key: string;
	value?: string;
};

export type VercelCookieHasField = {
	type: 'cookie';
	key: string;
	value?: string;
};

export type VercelQueryHasField = {
	type: 'query';
	key: string;
	value?: string;
};

export type VercelHandleValue =
	| 'rewrite'
	| 'filesystem' // check matches after the filesystem misses
	| 'resource'
	| 'miss' // check matches after every filesystem miss
	| 'hit'
	| 'error'; //  check matches after error (500, 404, etc.)

export type VercelHandler = {
	handle: VercelHandleValue;
	src?: string;
	dest?: string;
	status?: number;
};

export type VercelImageFormat = 'image/avif' | 'image/webp';
export type VercelImageFormatWithoutPrefix = StripPrefix<VercelImageFormat, 'image/'>;
export type StripPrefix<T extends string, K extends string> = T extends `${K}${infer V}` ? V : T;

export type VercelImageRemotePattern = {
	protocol?: 'http' | 'https';
	hostname: string;
	port?: string;
	pathname?: string;
};

export type VercelImagesConfig = {
	sizes: number[];
	domains: string[];
	remotePatterns?: VercelImageRemotePattern[];
	minimumCacheTTL?: number; // seconds
	formats?: VercelImageFormat[];
	dangerouslyAllowSVG?: boolean;
	contentSecurityPolicy?: string;
	contentDispositionType?: string;
};

export type VercelWildCard = {
	domain: string;
	value: string;
};

export type VercelWildcardConfig = Array<VercelWildCard>;

export type VercelOverride = {
	path?: string;
	contentType?: string;
};

export type VercelOverrideConfig = Record<string, VercelOverride>;

export type VercelCron = {
	path: string;
	schedule: string;
};

export type VercelCronsConfig = VercelCron[];

/**
 * Types for the processed Vercel build output (config, functions + static assets).
 */

export type Override<T, K extends keyof T, V> = Omit<T, K> & { [key in K]: V };

export type ProcessedVercelRoutes = {
	none: VercelSource[];
	filesystem: VercelSource[];
	miss: VercelSource[];
	rewrite: VercelSource[];
	resource: VercelSource[];
	hit: VercelSource[];
	error: VercelSource[];
};
export type VercelPhase = keyof ProcessedVercelRoutes;

export type ProcessedVercelConfig = Override<VercelConfig, 'routes', ProcessedVercelRoutes>;

export type BuildOutputStaticAsset = { type: 'static' };
export type BuildOutputStaticOverride = {
	type: 'override';
	path: string;
	headers?: Record<string, string>;
};
export type BuildOutputStaticItem = BuildOutputStaticAsset | BuildOutputStaticOverride;

export type BuildOutputFunction = {
	type: 'function' | 'middleware';
	entrypoint: string;
};

export type BuildOutputItem = BuildOutputFunction | BuildOutputStaticItem;
export type ProcessedVercelBuildOutput = Map<string, BuildOutputItem>;

export type EdgeFunction = {
	default: (request: Request, context: ExecutionContext) => Response | Promise<Response>;
};

export type AdjustedBuildOutputFunction = Override<BuildOutputFunction, 'entrypoint', string>;
export type VercelBuildOutputItem = AdjustedBuildOutputFunction | BuildOutputStaticItem;

export type VercelBuildOutput = {
	[key: string]: VercelBuildOutputItem;
};
