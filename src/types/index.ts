export * from './build-output-api';
export * from './request-context';
export type BuildMetadata = {
	/** Locales used by the application (collected from the Vercel output) */
	collectedLocales: string[];
};
