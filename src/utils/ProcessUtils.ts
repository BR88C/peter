import { Presences } from '../config/Presences';

// Import modules.
import { ClusterStats, Master, Worker } from 'discord-rose';

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
    for (const entry of stats) master.log(`\x1b[35mStats checkup | Shard count: ${entry.shards.length} | Guilds: ${entry.shards.reduce((p, c) => p + c.guilds, 0)} | Average Ping: ${Math.round(entry.shards.reduce((p, c) => p + c.ping, 0) / entry.shards.length)}ms | Memory usage: ${Math.round(entry.cluster.memory / 1e4) / 100}mb`, master.clusters.get(entry.cluster.id));
});
