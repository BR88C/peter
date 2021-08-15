"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `devstats`,
    exec: (ctx) => {
        ctx.worker.comms.getStats()
            .then((stats) => {
            const shards = stats.map((s) => s.shards).reduce((p, c) => p.concat(c), []);
            ctx.embed
                .color(Constants_1.Constants.DEV_STATS_EMBED_COLOR)
                .title(`Dev Stats`)
                .field(`Version`, `\`${process.env.npm_package_version ?? `Unavailable`}\``, true)
                .field(`Uptime`, `\`${discord_utils_1.timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3)}\``, true)
                .field(`Total Guilds`, `\`${shards.reduce((p, c) => p + c.guilds, 0)}\``, true)
                .field(`Average Ping`, `\`${Math.round((shards.reduce((p, c) => p + c.ping, 0) ?? 0) / shards.length)}ms\``, true)
                .field(`Total Memory Usage`, `\`${Math.round((stats.reduce((p, c) => p + c.cluster.memory, 0) ?? 0) / 1e4) / 100}mb\``, true)
                .field(`Cluster stats`, `\`\`\`\n${discord_utils_1.centerString(`Cluster`, 11)} | ${discord_utils_1.centerString(`Memory Usage`, 16)}\n${stats.reduce((p, c) => `${p}${discord_utils_1.centerString(c.cluster.id, 11)} | ${discord_utils_1.centerString(`${Math.round(c.cluster.memory / 1e4) / 100}mb`, 16)}\n`, ``)}\`\`\``, false)
                .field(`Shard stats`, `\`\`\`\n${discord_utils_1.centerString(`Shard`, 9)} | ${discord_utils_1.centerString(`State`, 9)} | ${discord_utils_1.centerString(`Guilds`, 10)} | ${discord_utils_1.centerString(`Ping`, 8)}\n${shards.reduce((p, c) => `${p}${discord_utils_1.centerString(`${c.id}`, 9)} | ${discord_utils_1.centerString(`${c.state}`, 9)} | ${discord_utils_1.centerString(`${c.guilds}`, 10)} | ${discord_utils_1.centerString(`${Math.round(c.ping)}ms`, 8)}\n`, ``)}\`\`\``, false)
                .field(`\u200B`, `\`\`\`\n Clusters: ${stats.length}  |  Shards: ${shards.length}  | Shards per Cluster: ${ctx.worker.options.shardsPerCluster} \`\`\``, false)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to get the bot's stats. Please try again.`);
        });
    }
};
