import type { BuildOutput } from '@/types/build-output';

import { functionAsset, htmlAsset } from '../run-test-set';

export const fileSystem: BuildOutput = {
	...functionAsset('/api/hello'),
	...htmlAsset('/404'),
	...htmlAsset('/500'),
};
