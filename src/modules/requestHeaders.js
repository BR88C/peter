/* Functions for handling request headers */

const miniget = require(`miniget`);
const log = require(`./log.js`);
const randomInt = require(`../utils/randomInt.js`);

const requestHeaders = {
    getHeaders: () => {
        if (!this.checkCookies()) return;

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
    },

    checkHeaders: () => {
        if (!process.env.COOKIES) {
            log(`WARNING: Cookies request header is undefined.`, `yellow`)
            return false;
        }

        if (!process.env.YOUTUBE_IDENTITY_TOKENS) {
            log(`WARNING: Youtube identity token request header is undefined.`, `yellow`)
            return false;
        }

        if (typeof process.env.COOKIES !== `string`) {
            log(`WARNING: Cookies request header is not defined properly.`, `yellow`)
            return false;
        }

        if (typeof process.env.YOUTUBE_IDENTITY_TOKENS !== `string`) {
            log(`WARNING: Youtube identity token request header is not defined properly.`, `yellow`)
            return false;
        }

        let cookies = JSON.parse(process.env.COOKIES);
        let identityToken = JSON.parse(process.env.YOUTUBE_IDENTITY_TOKENS);

        if (cookies.length !== identityToken.length) {
            log(`WARNING: Request headers array lengths do not match.`, `yellow`)
            return false;
        }

        return true;
    },

    setDefaultHeaders: () => {
        const getFirefoxUserAgent = () => {
            let date = new Date();
            let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + `.0`;
            return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`
        };

        const headers = {
            "User-Agent": getFirefoxUserAgent(),
            "Accept-Language": `en-US,en;q=0.5`
        };

        miniget.defaultOptions.headers = headers;

        log(`Successfully set miniget headers!`, `green`);
    }
};

module.exports = requestHeaders;