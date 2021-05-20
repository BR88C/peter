/**
 * Simplified advanced logging.
 * @param {string} msg The message to log.
 * @param {Object} [cluster] The cluster Object.
 * @param {{ color: string?, timestamp: boolean? }} [options] Logging options. Color defaults to green, and timestamp defaults to true.
 * @returns {Void} Void.
 */
const log = (msg, cluster, options = { color: `green`, timestamp: true }) => {
    if (cluster?.id) msg = `[Cluster ${cluster.id}] ${msg}`;
    else msg = `[Master] ${msg}`;

    if (options.timestamp) {
        const time = new Date();
        const second = time.getSeconds().toString().padStart(2, `0`);
        const minute = time.getMinutes().toString().padStart(2, `0`);
        const hour = time.getHours().toString().padStart(2, `0`);
        const day = time.getDate().toString().padStart(2, `0`);
        const month = (time.getMonth() + 1).toString().padStart(2, `0`);
        const year = time.getFullYear().toString();
        msg = `[${month}-${day}-${year} ${hour}:${minute}:${second}] ${msg}`;
    }

    let logColor;
    switch (options.color) {
        case `black`:
            logColor = `\x1b[30m`;
            break;
        case `red`:
            logColor = `\x1b[31m`;
            break;
        case `green`:
            logColor = `\x1b[32m`;
            break;
        case `yellow`:
            logColor = `\x1b[33m`;
            break;
        case `blue`:
            logColor = `\x1b[34m`;
            break;
        case `magenta`:
            logColor = `\x1b[35m`;
            break;
        case `cyan`:
            logColor = `\x1b[36m`;
            break;
        case `white`:
            logColor = `\x1b[37m`;
            break;
        default:
            throw new Error(`Invalid logging color.`);
    }

    console.log(logColor, msg);
};

module.exports = log;