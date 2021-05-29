// Import modules.
import { Master } from 'discord-rose';

export interface Header {
    cookie: string
    'x-youtube-identity-token': string // eslint-disable-line quotes
}

/**
 * Gets a random Header from .env.
 * @returns The random Header object.
 */
export const getEnvHeaders = (): Header => {
    if (!checkEnvHeaders()) throw new Error(`Headers are not properly defined.`);

    const cookies: string[] = JSON.parse(process.env.COOKIES ?? `[]`);
    const identityTokens: string[] = JSON.parse(process.env.YOUTUBE_IDENTITY_TOKENS ?? `[]`);

    return {
        cookie: cookies[~~(cookies.length * Math.random())],
        'x-youtube-identity-token': identityTokens[~~(identityTokens.length * Math.random())]
    };
};

/**
 * Checks headers from .env.
 * @param master The Master object. If provided, it will log if headers are defined properly, and if not, what the issue is.
 * @returns If the headers are defined properly.
 */
export const checkEnvHeaders = (master?: Master): boolean => {
    if (!process.env.COOKIES) {
        if (master) master.log(`\x1b[33mWARNING: Cookies request header is undefined.`);
        return false;
    }

    if (!process.env.YOUTUBE_IDENTITY_TOKENS) {
        if (master) master.log(`\x1b[33mWARNING: Youtube identity token request header is undefined.`);
        return false;
    }

    if (typeof process.env.COOKIES !== `string`) {
        if (master) master.log(`\x1b[33mWARNING: Cookies request header is not defined properly.`);
        return false;
    }

    if (typeof process.env.YOUTUBE_IDENTITY_TOKENS !== `string`) {
        if (master) master.log(`\x1b[33mWARNING: Youtube identity token request header is not defined properly.`);
        return false;
    }

    const cookies = JSON.parse(process.env.COOKIES);
    const identityToken = JSON.parse(process.env.YOUTUBE_IDENTITY_TOKENS);

    if (cookies.length !== identityToken.length) {
        if (master) master.log(`\x1b[33mWARNING: Request headers array lengths do not match.`);
        return false;
    }

    if (master) master.log(`\x1b[32mRequest headers are properly defined.`);
    return true;
};
