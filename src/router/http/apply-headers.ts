import type { MatchPCREResult } from '../pcre';
import { applyPCREMatches } from '../pcre';

/**
 * Applies a set of headers to a response.
 *
 * If the header key is `set-cookie`, the value will be appended. Otherwise, the value will be set
 * and overridden to prevent duplicates which sometimes happens with headers like `x-matched-path`.
 *
 * @param target Headers object to apply to.
 * @param source Headers to apply.
 * @param pcreMatch PCRE match result to apply to header values.
 */
export const applyHeaders = (
	target: Headers,
	source: Record<string, string> | Headers,
	pcreMatch?: MatchPCREResult,
): void => {
	const entries = source instanceof Headers ? source.entries() : Object.entries(source);
	for (const [key, value] of entries) {
		const lowerKey = key.toLowerCase();
		const newValue = pcreMatch?.match
			? applyPCREMatches(value, pcreMatch.match, pcreMatch.captureGroupKeys)
			: value;

		if (lowerKey === 'set-cookie') {
			target.append(lowerKey, newValue);
		} else {
			target.set(lowerKey, newValue);
		}
	}
};
