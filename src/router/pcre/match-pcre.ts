// pcre-to-regexp converts a PCRE string to a regular expression. It also extracts the named
// capture group keys, which is useful for matching and replacing parameters.
// This is the same library used by Vercel in the build output, and is used here to ensure
// consistency and proper support.
// eslint-disable-next-line import/extensions
import createPCRE from 'pcre-to-regexp/dist/index.js';

export type MatchPCREResult = {
	match: RegExpMatchArray | null;
	captureGroupKeys: string[];
};

/**
 * Checks if a value matches with a PCRE-compatible string, and extract the capture group keys.
 *
 * @param expr PCRE-compatible string.
 * @param val String to check with the regular expression.
 * @param caseSensitive Whether the regular expression should be case sensitive.
 * @returns The result of the matcher and the named capture group keys.
 */
export const matchPCRE = (
	expr: string,
	val: string | undefined | null,
	caseSensitive?: boolean,
): MatchPCREResult => {
	if (val === null || val === undefined) {
		return { match: null, captureGroupKeys: [] };
	}

	const flag = caseSensitive ? '' : 'i';
	const captureGroupKeys: string[] = [];

	const matcher = createPCRE(`%${expr}%${flag}`, captureGroupKeys);
	const match = matcher.exec(val);

	return { match, captureGroupKeys };
};
