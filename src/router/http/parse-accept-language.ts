/**
 * Parses the Accept-Language header value and returns an array of locales sorted by quality.
 *
 * @param headerValue Accept-Language header value.
 * @returns Array of locales sorted by quality.
 */
export const parseAcceptLanguage = (headerValue: string): string[] =>
	headerValue
		.split(',')
		.map((val) => {
			const [lang, qual] = val.split(';') as [string, string | undefined];
			const quality = parseFloat((qual ?? 'q=1').replace(/q *= */gi, ''));

			return [lang.trim(), Number.isNaN(quality) ? 1 : quality] as [string, number];
		})
		.sort((a, b) => b[1] - a[1])
		.map(([locale]) => (locale === '*' || locale === '' ? [] : locale))
		.flat();
