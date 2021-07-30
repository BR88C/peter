import { centerString } from './StringUtils';
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
    console.log(`\x1b[37m${dateTimestamp(new Date())} | \x1b[${cluster?.id ? `36` : `34`}m${centerString(clusterName, Constants.MAX_CLUSTER_LOG_LENGTH)}\x1b[37m|  ${msg}`.replace(/\n/g, ` `));
};

/**
 * Log an error.
 * @param error The error to log.
 */
export const logError = (error: any): void => {
    console.log(`\x1b[31m`);
    console.error(error);
    console.log(`\x1b[37m`);
}

/**
 * Creates and logs a logging header.
 */
export const logHeader = (): void => console.log(`\n\x1b[35m${TextArt}\n\nBy ${Config.devs.tags.join(`, `)}\n`);
