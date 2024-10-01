import type { Route } from '@/types/build-output';
import type { ImagesConfig } from '@/types/images';

export type WildCard = { domain: string; value: string };

type Override = { path?: string; contentType?: string };

type Cron = { path: string; schedule: string };

export type VercelConfig = {
	version: 3;
	routes?: Route[];
	images?: ImagesConfig;
	wildcard?: WildCard[];
	overrides?: Record<string, Override>;
	framework?: { version: string };
	cache?: string[];
	crons?: Cron[];
};
