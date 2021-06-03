import { checkEnvHeaders, getEnvHeaders } from '../utils/Headers';
import { Constants } from '../config/Constants';

// Import modules.
import { CommandError } from 'discord-rose';
import { validateURL } from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr, { getFilters } from 'ytsr';

/**
 * Search class - Used for getting YouTube URLs from a query.
 * @class
 */
export class Search {
    /**
     * The search query.
     */
    public query: string

    /**
     * The type of query. Determined automatically when creating the class.
     */
    public queryType: `videoURL` | `playlistURL` | `notURL`

    /**
     * Create a search class.
     * @param query The query to be used.
     * @constructor
     */
    constructor (query: string) {
        this.query = query;
        this.queryType = validateURL(this.query) ? `videoURL` : ((this.query.match(Constants.PLAYLIST_REGEX) ?? [])[2] ? `playlistURL` : `notURL`);
    }

    /**
     * Gets a single URL from the query.
     * If the query is a playlist URL, it will return the playlist URL, not a video in the playlist.
     * @returns The URL.
     */
    public async getURL (): Promise<string> {
        if (this.queryType !== `notURL`) return this.query;

        const searchFilters = await getFilters(this.query, { requestOptions: (checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined) as any }).catch((error) => {
            throw new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`);
        });
        const searchFilter: ytsr.Filter | undefined = searchFilters.get(`Type`)?.get(`Video`);
        if (!searchFilter?.url) throw new CommandError(`Unable to find video based on the search query.`);

        const ytsrResult: ytsr.Result = await ytsr(searchFilter.url, {
            limit: 1,
            requestOptions: (checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined) as any
        }).catch((error) => {
            throw new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`);
        });

        if (!ytsrResult.items[0]) throw new CommandError(`Unable to find video based on the search query.`);

        return (ytsrResult.items[0] as any).url;
    }

    /**
     * Gets multiple video URLs from a search query. The search query must not be a URL.
     * This DOES NOT get URLs from a playlist. Use Search#getPlaylistURLs() instead.
     * @param limit The number of URLs to limit the search to. Defaults to 10.
     * @returns An array of the found URLs.
     */
    public async getURLs (limit: number = 10): Promise<string[]> {
        if (this.queryType !== `notURL`) throw new CommandError(`Internal error: Cannot get URLs from a single URL.`);

        const searchFilters = await getFilters(this.query, { requestOptions: (checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined) as any }).catch((error) => {
            throw new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`);
        });
        const searchFilter: ytsr.Filter | undefined = searchFilters.get(`Type`)?.get(`Video`);
        if (!searchFilter?.url) throw new CommandError(`Unable to find videos based on the search query.`);

        const ytsrResult: ytsr.Result = await ytsr(searchFilter.url, {
            limit: limit,
            requestOptions: (checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined) as any
        }).catch((error) => {
            throw new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`);
        });

        if (!ytsrResult.items.length) throw new CommandError(`Unable to find videos based on the search query.`);

        const foundURLs: string[] = [];
        for (const item of ytsrResult.items) foundURLs.push((item as any).url);
        return foundURLs;
    }

    /**
     * Gets the URLs of all videos in a playlist.
     * @param limit The maximum number of URLs to get. Defaults to infinity.
     * @returns An array of the found URLs.
     */
    public async getPlaylistURLs (limit: number = Infinity): Promise<string[]> {
        if (this.queryType !== `playlistURL`) throw new CommandError(`Internal error: Cannot get playlist URLs from a non-playlist query.`);

        const ytplResult: ytpl.Result = await ytpl((this.query.match(Constants.PLAYLIST_REGEX) ?? [])[2], {
            limit: limit,
            requestOptions: (checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined) as any
        }).catch((error) => {
            throw new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`);
        });

        const foundURLs: string[] = [];
        for (const item of ytplResult.items) foundURLs.push(item.url);
        return foundURLs;
    }
}
