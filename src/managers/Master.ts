import Config from '../config/Config';

// Import modules.
import { Api } from '@top-gg/sdk';
import { MasterManager as Master, Utils } from '@br88c/discord-utils';
import { resolve } from 'path';

export default class MasterManager extends Master {
    /**
     * The manager's top.gg API client.
     */
    topgg: Api | null

    constructor () {
        super({
            botInfo: {
                inviteLink: Config.inviteLink,
                mode: process.env.NODE_ENV ?? `dev`,
                name: Config.botName,
                supportServer: Config.supportServer,
                website: Config.website
            },
            botOptions: {
                cache: {
                    channels: false,
                    guilds: true,
                    members: false,
                    messages: false,
                    roles: false,
                    self: false,
                    users: false,
                    voiceStates: true
                },
                cacheControl: {
                    guilds: [`member_count`], voiceStates: []
                },
                rest: { version: 9 },
                shards: `auto`,
                shardsPerCluster: 1,
                token: process.env.BOT_TOKEN!
            },
            statsOptions: {
                influx: process.env.INFLUX_TOKEN ? Object.assign(Config.influx, { 
                    extraStatsCallback: async () => {
                        return [];
                    },
                    token: process.env.INFLUX_TOKEN
                }) : undefined,
                interval: Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]
            },
            workerFile: resolve(__dirname, `./run/runWorker.js`)
        });

        // Create Top.gg API client if a token is set.
        if (process.env.TOPGG_TOKEN) {
            this.topgg = new Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        } else this.log(`No Top.gg token provided, skipping initialization`);

        // Check vote command.
        this.handlers.on(`CHECK_VOTE`, async (cluster, data, resolve) => resolve(this.topgg ? await this.topgg.hasVoted(data).catch((error) => {
            Utils.logError(error);
            return true;
        }) : true));
    }
}
