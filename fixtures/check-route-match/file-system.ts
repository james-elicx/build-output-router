import type { BuildOutput } from '../run-test-set';
import { functionAsset, htmlAsset } from '../run-test-set';

export const fileSystem: BuildOutput = {
	...functionAsset('/index'),
	...htmlAsset('/404'),
	...htmlAsset('/500'),
};
