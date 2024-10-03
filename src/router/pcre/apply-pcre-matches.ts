/**
 * Processes the value and replaced any matched parameters (index or named capture groups).
 *
 * @param rawStr String to process.
 * @param match Matches from the PCRE matcher.
 * @param captureGroupKeys Named capture group keys from the PCRE matcher.
 * @param opts Options for applying the PCRE matches.
 * @returns The processed string with replaced parameters.
 */
export const applyPCREMatches = (
	rawStr: string,
	match: RegExpMatchArray,
	captureGroupKeys: string[],
	{ namedOnly }: { namedOnly?: boolean } = {},
): string =>
	rawStr.replace(/\$([a-zA-Z0-9_]+)/g, (originalValue, key) => {
		const index = captureGroupKeys.indexOf(key);

		// If we only want named capture groups, and the key is not found, return the original value.
		if (namedOnly && index === -1) {
			return originalValue;
		}

		// If the extracted key does not exist as a named capture group from the matcher, we can
		// reasonably assume it's a number and return the matched index. Fallback to an empty string.
		return (index === -1 ? match[parseInt(key, 10)] : match[index + 1]) || '';
	});
