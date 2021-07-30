"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtils_1 = require("../../utils/StringUtils");
const Constants_1 = require("../../config/Constants");
const Time_1 = require("../../utils/Time");
exports.default = {
    command: `devstats`,
    exec: async (ctx) => {
        const stats = await ctx.worker.comms.getStats().catch(() => void ctx.error(`Unable to get the bot's stats.`));
        const shards = stats?.map((s) => s.shards).reduce((p, c) => p.concat(c), []);
        ctx.embed
            .color(Constants_1.Constants.DEV_STATS_EMBED_COLOR)
            .title(`Dev Stats`)
            .field(`Version`, `\`${process.env.npm_package_version ?? `Unavailable`}\``, true)
            .field(`Uptime`, (stats ? `\`${Time_1.timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3)}\`` : `N/A`), true)
            .field(`Total Guilds`, `\`${shards?.reduce((p, c) => p + c.guilds, 0)}\``, true)
            .field(`Average Ping`, `\`${Math.round((shards?.reduce((p, c) => p + c.ping, 0) ?? 0) / (shards?.length ?? 1))}ms\``, true)
            .field(`Total Memory Usage`, `\`${Math.round((stats?.reduce((p, c) => p + c.cluster.memory, 0) ?? 0) / 1e4) / 100}mb\``, true)
            .field(`Cluster stats`, `\`\`\`\n${StringUtils_1.centerString(`Cluster`, 11)} | ${StringUtils_1.centerString(`Memory Usage`, 16)}\n${stats?.reduce((p, c) => p + `${StringUtils_1.centerString(c.cluster.id, 11)} | ${StringUtils_1.centerString(`${Math.round(c.cluster.memory / 1e4) / 100}mb`, 16)}\n`, ``)}\`\`\``, false)
            .field(`Shard stats`, `\`\`\`\n${StringUtils_1.centerString(`Shard`, 9)} | ${StringUtils_1.centerString(`State`, 9)} | ${StringUtils_1.centerString(`Guilds`, 10)} | ${StringUtils_1.centerString(`Ping`, 8)}\n${shards?.reduce((p, c) => p + `${StringUtils_1.centerString(`${c.id}`, 9)} | ${StringUtils_1.centerString(`${c.state}`, 9)} | ${StringUtils_1.centerString(`${c.guilds}`, 10)} | ${StringUtils_1.centerString(`${Math.round(c.ping)}ms`, 8)}\n`, ``)}\`\`\``, false)
            .field(`\u200B`, `\`\`\`\n Clusters: ${stats?.length}  |  Shards: ${shards?.length}  | Shards per Cluster: ${ctx.worker.options.shardsPerCluster} \`\`\``, false)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
