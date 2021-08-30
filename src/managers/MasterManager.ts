import Config from '../config/Config';

// Import modules.
import { Api } from '@top-gg/sdk';
import { log, logError } from '@br88c/discord-utils';
import { Master } from 'discord-rose';
import { resolve } from 'path';
import { statsCheckup } from '@br88c/discord-utils';

/**
 * The Master manager class.
 * @class
 * @extends Master
 */
export default class MasterManager extends Master {
    /**
     * The topgg API client.
     */
    public topgg: Api | null

    /**
     * Create the Master manager.
     * @constructor
     */
    constructor () {
        super(resolve(__dirname, `./run/runWorker.js`), {
            cache: Config.cache,
            cacheControl: Config.cacheControl as any,
            log: log,
            rest: { version: 9 },
            shards: Config.shards[process.env.NODE_ENV ?? `dev`],
            shardsPerCluster: Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
            token: process.env.BOT_TOKEN ?? ``
        });

        // Log mode.
        this.log(`\x1b[35mRunning in \x1b[33m${process.env.NODE_ENV ?? `dev`}\x1b[35m mode.`);

        // Start master.
        this.start().catch((error) => logError(error));

        // Create Top.gg API client if a token is set.
        if (process.env.TOPGG_TOKEN) {
            this.topgg = new Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        } else this.log(`No Top.gg token provided, skipping initialization`);

        // Check vote command.
        this.handlers.on(`CHECK_VOTE`, async (cluster, data, resolve) => resolve(this.topgg ? await this.topgg.hasVoted(data).catch((error) => {
            logError(error);
            return true;
        }) : true));

        // On ready.
        this.once(`READY`, () => {
            // Run stats checkups at a set interval.
            setInterval(() => void (async () => {
                const stats = await statsCheckup(this).catch((error) => logError(error));
                if (stats && this.topgg) this.topgg.postStats({ serverCount: stats.totalGuilds }).then(() => this.log(`Posted stats to Top.gg`)).catch(() => this.log(`Error posting stats to Top.gg`));
            })(), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);

            // Log ready.
            this.log(`\x1b[35mMaster up since ${new Date().toLocaleString()}`);
        });
    }
}
