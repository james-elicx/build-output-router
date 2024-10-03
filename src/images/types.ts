export type RemotePattern = {
	protocol?: 'http' | 'https';
	hostname: string;
	port?: string;
	pathname?: string;
};

type StripPrefix<T extends string, K extends string> = T extends `${K}${infer V}` ? V : T;

export type ImageFormat = 'image/avif' | 'image/webp';
export type ImageFormatWithoutPrefix = StripPrefix<ImageFormat, 'image/'>;

export type ImagesConfig = {
	sizes: number[];
	domains: string[];
	remotePatterns?: RemotePattern[];
	minimumCacheTTL?: number; // seconds
	formats?: ImageFormat[];
	dangerouslyAllowSVG?: boolean;
	contentSecurityPolicy?: string;
	contentDispositionType?: string;
};
