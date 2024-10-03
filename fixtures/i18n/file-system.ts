import type { BuildOutput } from '../run-test-set';
import { functionAsset, htmlAsset, staticAsset } from '../run-test-set';

export const staticLocales = ['en', 'fr', 'nl', 'es'] as const;
export const nonStaticLocales = ['de'] as const;
export const locales = [...staticLocales, ...nonStaticLocales] as const;

export const fileSystem: BuildOutput = {
	...functionAsset('/index'),
	...functionAsset('/gssp'),
	...functionAsset('/gsp/[slug]'),
	...staticAsset('/_next/static/chunks/index.js'),
	...locales.reduce(
		(acc, locale) => ({
			...acc,
			...(staticLocales.includes(locale as (typeof staticLocales)[number])
				? {
						...staticAsset(`/_next/data/_LMNvx1uNzgkLzYi9-YVv/${locale}/gsp.json`),
						...htmlAsset(`/${locale}`),
					}
				: {}),
			...htmlAsset(`/${locale}/404`),
			...htmlAsset(`/${locale}/500`),
			...htmlAsset(`/${locale}/gsp`),
		}),
		{},
	),
};
