import type { BuildOutput } from '../run-test-set';
import { functionAsset, htmlAsset, staticAsset } from '../run-test-set';

export const fileSystem: BuildOutput = {
	...functionAsset('/api/hello'),
	...functionAsset('/[lang]'),
	...htmlAsset('/404'),
	...htmlAsset('/500'),
	...staticAsset('/robots.txt', {
		'content-type': 'text/plain',
		vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch',
	}),
};
