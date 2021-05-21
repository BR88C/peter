const config = require(`./config/config.js`);
const log = require(`./utils/log.js`);

// Import node modules.
const { Master } = require(`discord-rose`);
const path = require(`path`);

/**
 * Creates a master process.
 * @returns {Promise<Object>} A promise that resolves once master emits the READY event. Returns the master Object.
 */
const createMaster = () => new Promise((resolve, reject) => {
    // Create master.
    const master = new Master(path.resolve(__dirname, `./worker.js`), {
        cache: config.cache,
        cacheControl: config.cacheControl,
        log: log,
        shards: config.shards[process.env.NODE_ENV],
        shardsPerCluster: config.shardsPerCluster[process.env.NODE_ENV],
        token: process.env.BOT_TOKEN
    });

    // Start master.
    master.start();

    // On ready.
    master.on(`READY`, () => {
        // Run stats checkups at a set interval.
        statsCheckup(master);
        setInterval(() => statsCheckup(master), config.statsCheckupInterval[process.env.NODE_ENV]);

        // Resolve the master Object.
        resolve(master);
    });
});

/**
 * Logs a stats checkup.
 * @param {Object} master The master Object.
 * @returns {Void} Void.
 */
const statsCheckup = (master) => master.getStats().then((stats) => {
    for (const entry of stats) {
        let totalShardPing = 0;
        let totalGuilds = 0;
        for (const shard of entry.shards) {
            totalShardPing += shard.ping;
            totalGuilds += shard.guilds;
        }
        log(`Stats checkup | Shard count: ${entry.shards.length} | Guilds: ${totalGuilds} | Average Ping: ${totalShardPing / entry.shards.length}ms | Memory usage: ${Math.round(entry.cluster.memory / 1e4) / 100}mb`, { id: entry.cluster.id }, `yellow`);
    }
});

module.exports = {
    createMaster, statsCheckup
};
