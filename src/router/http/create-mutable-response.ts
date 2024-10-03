/**
 * Creates a new Response object with the same body and headers as the original.
 *
 * Useful when the response object may be immutable.
 *
 * @param resp Response object to re-create.
 * @returns A new Response object with the same body and headers.
 */
export const createMutableResponse = (resp: Response): Response => new Response(resp.body, resp);
