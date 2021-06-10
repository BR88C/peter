"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsCheckup = exports.setRandomPresence = void 0;
const Presences_1 = require("../config/Presences");
/**
 * Sets a random presence on the Worker.
 * @param worker The Worker object.
 */
const setRandomPresence = (worker) => {
    const presence = Presences_1.Presences[~~(Presences_1.Presences.length * Math.random())];
    worker.setStatus(presence.type, presence.name, presence.status);
};
exports.setRandomPresence = setRandomPresence;
/**
 * Logs a stats checkup.
 * @param master The Master object.
 */
const statsCheckup = async (master) => await master.getStats().then((stats) => {
    for (const entry of stats)
        master.log(`\x1b[35mStats checkup | Shard count: ${entry.shards.length} | Guilds: ${entry.shards.reduce((p, c) => p + c.guilds, 0)} | Average Ping: ${Math.round(entry.shards.reduce((p, c) => p + c.ping, 0) / entry.shards.length)}ms | Memory usage: ${Math.round(entry.cluster.memory / 1e4) / 100}mb`, master.clusters.get(entry.cluster.id));
});
exports.statsCheckup = statsCheckup;
