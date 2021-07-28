import { MasterManager } from '../managers/MasterManager';
import { Presences } from '../config/Presences';
import { WorkerManager } from '../managers/WorkerManager';

/**
 * Sets a random presence on the Worker.
 * @param worker The Worker object.
 */
export const setRandomPresence = (worker: WorkerManager): void => {
    const presence = Presences[~~(Presences.length * Math.random())];
    worker.setStatus(presence.type, presence.name, presence.status);
};

/**
 * Logs a stats checkup.
 * @param master The Master object.
 */
export const statsCheckup = async (master: MasterManager): Promise<void> => {
    const stats = await master.getStats();
    let totalGuilds = 0; let totalMemory = 0; let totalShards = 0;
    for (const entry of stats) {
        const guildCount = entry.shards.reduce((p, c) => p + c.guilds, 0);
        totalGuilds += guildCount;
        const memory = entry.cluster.memory;
        totalMemory += memory;
        const shardCount = entry.shards.length;
        totalShards += shardCount;
        master.log(`\x1b[35mStats checkup | Guilds: ${guildCount} | Shards: ${shardCount} | Ping: ${Math.round(entry.shards.reduce((p, c) => p + c.ping, 0) / entry.shards.length)}ms | Memory: ${Math.round(memory / 1e4) / 100}mb`, master.clusters.get(entry.cluster.id));
    }
    master.log(`\x1b[35mStats totals | Guilds: ${totalGuilds} | Shards: ${totalShards} | Memory: ${Math.round(totalMemory / 1e4) / 100}mb`);
    if (master.topgg) master.topgg.postStats({ serverCount: totalGuilds }).then(() => master.log(`Posted stats to Top.gg`)).catch(() => master.log(`Error posting stats to Top.gg`));
};
