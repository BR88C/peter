import { Config } from './config/Config';
import { Constants } from './config/Constants';
import { Presences } from './config/Presences';
import { TextArt } from './config/TextArt';

// Import modules.
import { Cluster, ClusterStats, Master, Worker } from 'discord-rose';

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
 */
export const log = (msg: string, cluster: Cluster | undefined): void => {
    const clusterName: string = cluster?.id ? `Cluster ${cluster.id}` : `Master`;
    msg = `\x1b[${cluster?.id ? `36` : `34`}m${` `.repeat(Math.floor((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}${clusterName}${` `.repeat(Math.ceil((Constants.MAX_CLUSTER_LOG_LENGTH - clusterName.length) / 2))}\x1b[37m|  ${msg}`;

    const time: Date = new Date();
    const second: string = time.getSeconds().toString().padStart(2, `0`);
    const minute: string = time.getMinutes().toString().padStart(2, `0`);
    const hour: string = time.getHours().toString().padStart(2, `0`);
    const day: string = time.getDate().toString().padStart(2, `0`);
    const month: string = (time.getMonth() + 1).toString().padStart(2, `0`);
    const year: string = time.getFullYear().toString();
    msg = `\x1b[37m${month}-${day}-${year} ${hour}:${minute}:${second} | ${msg}`;

    console.log(msg.replace(/\n/g, ` `));
};

/**
 * Creates and logs a logging header.
 */
export const logHeader = (): void => console.log(`\n\x1b[35m${TextArt}\n\nBy ${Config.devs.tags.join(`, `)}\n`);

/**
 * Sets a random presence on the Worker.
 * @param worker The Worker object.
 */
export const setRandomPresence = (worker: Worker): void => {
    const presence = Presences[~~(Presences.length * Math.random())];
    worker.setStatus(presence.type, presence.name, presence.status);
};

/**
 * Logs a stats checkup.
 * @param master The Master object.
 */
export const statsCheckup = async (master: Master): Promise<void> => await master.getStats().then((stats: ClusterStats[]) => {
    for (const entry of stats) {
        let totalShardPing: number = 0;
        let totalGuilds: number = 0;
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
    const hours: number = Math.floor(time / 60 / 60);
    const minutes: number = Math.floor(time / 60) - (hours * 60);
    const seconds: number = time % 60;
    return hours > 0 ? `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}` : `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;
};
