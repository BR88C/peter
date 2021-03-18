/* Functions for handling request headers */

const log = require(`./log.js`);
const randomInt = require(`../utils/randomInt.js`);

const requestHeaders = {
    /**
     * Check headers defined in .env.
     *
     * @returns {boolean} If headers are defined properly.
     */
    checkHeaders: () => {
        if (!process.env.COOKIES) {
            log(`WARNING: Cookies request header is undefined.`, `yellow`);
            return false;
        }

        if (!process.env.YOUTUBE_IDENTITY_TOKENS) {
            log(`WARNING: Youtube identity token request header is undefined.`, `yellow`);
            return false;
        }

        if (typeof process.env.COOKIES !== `string`) {
            log(`WARNING: Cookies request header is not defined properly.`, `yellow`);
            return false;
        }

        if (typeof process.env.YOUTUBE_IDENTITY_TOKENS !== `string`) {
            log(`WARNING: Youtube identity token request header is not defined properly.`, `yellow`);
            return false;
        }

        const cookies = JSON.parse(process.env.COOKIES);
        const identityToken = JSON.parse(process.env.YOUTUBE_IDENTITY_TOKENS);

        if (cookies.length !== identityToken.length) {
            log(`WARNING: Request headers array lengths do not match.`, `yellow`);
            return false;
        }

        return true;
    },

    /**
     * Get headers object for ytdl, ytsr, and ytpl requests.
     *
     * @returns {Object} Header object.
     */
    getHeaders: () => {
        if (!requestHeaders.checkHeaders()) return;

        let cookies = JSON.parse(process.env.COOKIES);
        cookies = cookies[randomInt(0, cookies.length - 1)];

        let identityToken = JSON.parse(process.env.YOUTUBE_IDENTITY_TOKENS);
        identityToken = identityToken[randomInt(0, identityToken.length - 1)];

        return {
            headers: {
                cookie: cookies,
                'x-youtube-identity-token': identityToken
            }
        };
    }
};

module.exports = requestHeaders;
