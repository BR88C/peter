import { TokenFilter } from '@br88c/node-utils';

/**
 * Get token filters.
 * @param additional Additional filters to return.
 */
export function tokenFilters (...additional: TokenFilter[]): TokenFilter[] {
    return [
        {
            token: process.env.BOT_TOKEN!,
            replacement: `%bot_token%`
        },
        {
            token: process.env.LAVALINK_PASSWORD!,
            replacement: `%lavalink_password%`
        }
    ].concat(...additional);
}
