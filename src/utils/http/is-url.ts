/**
 * Checks if a string is an URL.
 *
 * @param url String to check.
 * @returns Whether the string is an URL.
 */
export const isUrl = (url: string): boolean => /^https?:\/\//.test(url);
