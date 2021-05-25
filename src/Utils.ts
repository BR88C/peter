import { Constants } from './config/Constants';

// Import modules.
import {
    Cluster, ClusterStats, Master
} from 'discord-rose';

/**
 * Cleanses a string from markdown formatting, adding back slashes to do so.
 * @param str The string to cleanse.
 * @returns The cleansed string.
 */
export const cleanseMarkdown = (str: string): string => str
    .replace(/`/g, `\\\``) // Backticks
    .replace(/~/g, `\\-`) // Tildes
    .replace(/\*/g, `\\*`) // Asterisks
    .replace(/_/g, `\\_`) // Underlines
    .replace(/\|/g, `\\|`); // Vertical bars

/**
 * Simplified advanced logging.
 * @param msg The message to log.
 * @param cluster The cluster object.
 * @returns Void.
 */
export const log = (msg: string, cluster: Cluster): void => {
    const clusterName = cluster.id ? `Cluster ${cluster.id}` : `Master`;
    msg = `\x1b[${cluster.id ? `36` : `34`}m${` `.repeat(Math.floor((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}${clusterName}${` `.repeat(Math.ceil((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}\x1b[37m|  ${msg}`;

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

/**
 * Logs a stats checkup.
 * @param master The Master object.
 * @returns Void.
 */
export const statsCheckup = async (master: Master): Promise<void> => await master.getStats().then((stats: ClusterStats[]) => {
    for (const entry of stats) {
        let totalShardPing = 0;
        let totalGuilds = 0;
        for (const shard of entry.shards) {
            totalShardPing += shard.ping;
            totalGuilds += shard.guilds;
        }
        master.log(`\x1b[35mStats checkup | Shard count: ${entry.shards.length} | Guilds: ${totalGuilds} | Average Ping: ${totalShardPing / entry.shards.length}ms | Memory usage: ${Math.round(entry.cluster.memory / 1e4) / 100}mb`, master.clusters.get(entry.cluster.id));
    }
});

/**
 * Creates a timestamp.
 * @param time Time in milliseconds.
 * @returns The timestamp string.
 */
export const timestamp = (time: number): string => {
    time = Math.round(time / 1e3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) - (hours * 60);
    const seconds = time % 60;
    return hours > 0 ? `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}` : `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;
};
