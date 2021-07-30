import { Config } from '../config/Config';
import { log, logError } from '../utils/Log';
import { statsCheckup } from '../utils/ProcessUtils';

// Import modules.
import { Api } from '@top-gg/sdk';
import { Master } from 'discord-rose';
import { resolve } from 'path';

/**
 * The Master manager class.
 * @class
 * @extends Master
 */
export class MasterManager extends Master {
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
            cacheControl: Config.cacheControl,
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

        if (process.env.TOPGG_TOKEN) {
            this.topgg = new Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        } else this.log(`No Top.gg token provided, skipping initialization`);

        // @ts-expect-error Argument of type '"GET_VOTE"' is not assignable to parameter of type 'keyof ThreadEvents'.
        this.handlers.on(`GET_VOTE`, async (cluster, data: any, resolve: ((data: any) => void)) => { // eslint-disable-line @typescript-eslint/no-misused-promises
            const voted = this.topgg ? await this.topgg.hasVoted(data.user_id) : true;
            resolve(voted);
        });

        // On ready.
        this.once(`READY`, () => {
            // Run stats checkups at a set interval.
            setInterval(() => void (async () => await statsCheckup(this).catch((error) => logError(error)))(), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);

            // Log ready.
            this.log(`\x1b[35mMaster up since ${new Date().toLocaleString()}`);
        });
    }
};
