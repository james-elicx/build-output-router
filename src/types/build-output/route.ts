export type Phase =
	| 'none' // represents source routes that are not under a handler
	| 'rewrite'
	| 'filesystem' // check matches after the filesystem misses
	| 'resource'
	| 'miss' // check matches after every filesystem miss
	| 'hit'
	| 'error'; //  check matches after error (500, 404, etc.)

export type HandlerRoute = {
	handle: Exclude<Phase, 'none'>;
	src?: string;
	dest?: string;
	status?: number;
};

type SourceRouteLocale = {
	redirect?: Record<string, string>;
	cookie?: string;
};

export type SourceRouteHasField =
	| { type: 'host'; value: string }
	| { type: 'header'; key: string; value?: string }
	| { type: 'cookie'; key: string; value?: string }
	| { type: 'query'; key: string; value?: string };

export type SourceRoute = {
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
	has?: SourceRouteHasField[];
	missing?: SourceRouteHasField[];
	locale?: SourceRouteLocale;
	middlewarePath?: string;
	middlewareRawSrc?: string[];
};

export type Route = SourceRoute | HandlerRoute;

export type RoutesGroupedByPhase = Record<Phase, SourceRoute[]>;

export type BuildOutputItem =
	| { type: 'function' | 'middleware'; entrypoint: string }
	| { type: 'static'; path?: string; headers?: Record<string, string> };

export type BuildOutput = Record<string, BuildOutputItem>;
