import type { BuildOutput } from '@/types/build-output';

import { functionAsset, htmlAsset, staticAsset } from '../run-test-set';

export const fileSystem: BuildOutput = {
	...functionAsset('/api/hello'),
	...functionAsset('/[[...index]]'),
	...functionAsset('/dynamic/[pageId]'),
	...htmlAsset('/404'),
	...htmlAsset('/500'),
	...staticAsset('/favicon.ico'),
};
