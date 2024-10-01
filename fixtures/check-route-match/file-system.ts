import type { BuildOutput } from '@/types/build-output';

import { functionAsset, htmlAsset } from '../run-test-set';

export const fileSystem: BuildOutput = {
	...functionAsset('/index'),
	...htmlAsset('/404'),
	...htmlAsset('/500'),
};
