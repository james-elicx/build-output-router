/**
 * Checks if a source route's matcher uses the regex format for locales with a trailing slash, where
 * the locales specified are known.
 *
 * Determines whether a matcher is in the format of `^//?(?:en|fr|nl)/(.*)$`.
 *
 * @param src Source route `src` regex value.
 * @param locales Known available locales.
 * @returns Whether the source route matches the regex for a locale with a trailing slash.
 */
export const isLocaleTrailingSlashRegex = (src: string, locales: Set<string>) => {
	const prefix = '^//?(?:';
	const suffix = ')/(.*)$';

	if (!src.startsWith(prefix) || !src.endsWith(suffix)) {
		return false;
	}

	const foundLocales = src.slice(prefix.length, -suffix.length).split('|');
	return foundLocales.every((locale) => locales.has(locale));
};
