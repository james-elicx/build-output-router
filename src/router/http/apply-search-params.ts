/**
 * Merges search params from one URLSearchParams object to another.
 *
 * Only appends the parameter if the target does not contain it, or if the value is different and not undefined.
 *
 * For params prefixed with `nxtP`, it also sets the param without the prefix if it does not exist.
 * The `nxtP` prefix indicates that it is for Next.js dynamic route parameters. In some cases,
 * Next.js fails to derive the correct route parameters and so we need to set them manually.
 * https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/constants.ts#L3
 *
 * For params prefixed with `nxtI`, this is a route intercept. It sets the param without the prefix,
 * and removes any intercepts from the param's value. This is so that the route intercept is able
 * to have the correct route parameters for the page.
 * https://github.com/vercel/next.js/blob/cdf2b79ea/packages/next/src/shared/lib/router/utils/route-regex.ts#L6
 *
 * @param target Target that search params will be applied to.
 * @param source Source search params to apply to the target.
 */
export const applySearchParams = (target: URLSearchParams, source: URLSearchParams): void => {
	for (const [key, value] of source.entries()) {
		const nxtParamMatch = /^nxtP(.+)$/.exec(key);
		const nxtInterceptMatch = /^nxtI(.+)$/.exec(key);
		if (nxtParamMatch?.[1]) {
			target.set(key, value);
			target.set(nxtParamMatch[1], value);
		} else if (nxtInterceptMatch?.[1]) {
			target.set(nxtInterceptMatch[1], value.replace(/(\(\.+\))+/, ''));
		} else if (!target.has(key) || (!!value && !target.getAll(key).includes(value))) {
			target.append(key, value);
		}
	}
};
