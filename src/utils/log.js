const constants = require(`../config/constants.js`);

/**
 * Simplified advanced logging.
 * @param {string} msg The message to log.
 * @param {Object} [cluster] The cluster Object.
 * @returns {Void} Void.
 */
const log = (msg, cluster) => {
    const clusterName = cluster?.id ? `Cluster ${cluster.id}` : `Master`;
    msg = `\x1b[${cluster?.id ? `36` : `34`}m${` `.repeat(Math.floor((constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}${clusterName}${` `.repeat(Math.ceil((constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}\x1b[37m|  ${msg}`;

    const time = new Date();
    const second = time.getSeconds().toString().padStart(2, `0`);
    const minute = time.getMinutes().toString().padStart(2, `0`);
    const hour = time.getHours().toString().padStart(2, `0`);
    const day = time.getDate().toString().padStart(2, `0`);
    const month = (time.getMonth() + 1).toString().padStart(2, `0`);
    const year = time.getFullYear().toString();
    msg = `\x1b[37m${month}-${day}-${year} ${hour}:${minute}:${second} | ${msg}`;

    console.log(msg.replace(`\n`, ` `));
};

module.exports = log;
