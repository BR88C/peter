import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { dateTimestamp } from './Time';
import { TextArt } from '../config/TextArt';

// Import modules.
import { Cluster } from 'discord-rose';

/**
 * Simplified advanced logging.
 * @param msg The message to log.
 * @param cluster The cluster object.
 */
export const log = (msg: string, cluster: Cluster | undefined): void => {
    const clusterName: string = cluster?.id ? `Cluster ${cluster.id}` : `Master`;
    msg = `\x1b[${cluster?.id ? `36` : `34`}m${` `.repeat(Math.floor((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}${clusterName}${` `.repeat(Math.ceil((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}\x1b[37m|  ${msg}`;
    console.log(`\x1b[37m${dateTimestamp(new Date())} | ${msg}`.replace(/\n/g, ` `));
};

/**
 * Creates and logs a logging header.
 */
export const logHeader = (): void => console.log(`\n\x1b[35m${TextArt}\n\nBy ${Config.devs.tags.join(`, `)}\n`);
