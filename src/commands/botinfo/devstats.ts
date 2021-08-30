import Constants from '../../config/Constants';

// Import modules.
import { centerString, logError, timestamp } from '@br88c/discord-utils';
import { CommandOptions } from 'discord-rose';

export default {
    command: `devstats`,
    exec: (ctx) => {
        ctx.worker.comms.getStats()
            .then((stats) => {
                const shards = stats.map((s) => s.shards).reduce((p, c) => p.concat(c), []);
                ctx.embed
                    .color(Constants.DEV_STATS_EMBED_COLOR)
                    .title(`Dev Stats`)
                    .field(`Version`, `\`${process.env.npm_package_version ?? `Unavailable`}\``, true)
                    .field(`Uptime`, `\`${timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3)}\``, true)
                    .field(`Total Guilds`, `\`${shards.reduce((p, c) => p + c.guilds, 0)}\``, true)
                    .field(`Average Ping`, `\`${Math.round((shards.reduce((p, c) => p + c.ping, 0) ?? 0) / shards.length)}ms\``, true)
                    .field(`Total Memory Usage`, `\`${Math.round((stats.reduce((p, c) => p + c.cluster.memory, 0) ?? 0) / 1e4) / 100}mb\``, true)
                    .field(`Cluster stats`, `\`\`\`\n${centerString(`Cluster`, 11)} | ${centerString(`Memory Usage`, 16)}\n${stats.reduce((p, c) => `${p  }${centerString(c.cluster.id, 11)} | ${centerString(`${Math.round(c.cluster.memory / 1e4) / 100}mb`, 16)}\n`, ``)}\`\`\``, false)
                    .field(`Shard stats`, `\`\`\`\n${centerString(`Shard`, 9)} | ${centerString(`State`, 9)} | ${centerString(`Guilds`, 10)} | ${centerString(`Ping`, 8)}\n${shards.reduce((p, c) => `${p  }${centerString(`${c.id}`, 9)} | ${centerString(`${c.state}`, 9)} | ${centerString(`${c.guilds}`, 10)} | ${centerString(`${Math.round(c.ping)}ms`, 8)}\n`, ``)}\`\`\``, false)
                    .field(`\u200B`, `\`\`\`\n Clusters: ${stats.length}  |  Shards: ${shards.length}  | Shards per Cluster: ${ctx.worker.options.shardsPerCluster} \`\`\``, false)
                    .send()
                    .catch((error) => {
                        logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to get the bot's stats. Please try again.`);
            });
        
    }
} as CommandOptions;
