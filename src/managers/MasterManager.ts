import { Config } from '../config/Config';
import { log } from '../utils/Log';
import { statsCheckup } from '../utils/ProcessUtils';

// Import modules.
import { Master } from 'discord-rose';
import { resolve } from 'path';

/**
 * The Master manager class.
 * @class
 * @extends Master
 */
export class MasterManager extends Master {
    /**
     * Create the Master manager.
     * @constructor
     */
    constructor () {
        super(resolve(__dirname, `./run/runWorker.js`), {
            cache: Config.cache,
            cacheControl: Config.cacheControl,
            log: log,
            rest: {
                version: 9
            },
            shards: Config.shards[process.env.NODE_ENV ?? `dev`],
            shardsPerCluster: Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
            token: process.env.BOT_TOKEN ?? ``
        });

        // Log mode.
        this.log(`\x1b[35mRunning in \x1b[33m${process.env.NODE_ENV ?? `dev`}\x1b[35m mode.`);

        // Start master.
        this.start().catch((error) => this.log(error));

        // On ready.
        this.once(`READY`, () => {
            // Run stats checkups at a set interval.
            setInterval(() => void (async () => await statsCheckup(this).catch((error) => this.log(error)))(), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);

            // Log ready.
            this.log(`\x1b[35mMaster up since ${new Date().toLocaleString()}`);
        });
    }
};
