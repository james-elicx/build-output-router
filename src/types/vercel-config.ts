import type { Route } from './route';

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

export type VercelConfig = {
	version: 3;
	routes?: Route[];
	images?: VercelImagesConfig;
	wildcard?: VercelWildCard[];
	overrides?: VercelOverrideConfig;
	framework?: { version: string };
	cache?: string[];
	crons?: VercelCronsConfig;
};
