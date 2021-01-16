/* Create headers for miniget */

const miniget = require(`miniget`);
const log = require(`./log.js`);

const setHeaders = () => {
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

module.exports = setHeaders;