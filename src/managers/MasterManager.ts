import { checkEnvHeaders } from '../utils/Headers';
import { Config } from '../config/Config';
import { log } from '../utils/Log';
import { statsCheckup } from '../utils/ProcessUtils';

// Import modules.
import { Master } from 'discord-rose';
import { resolve } from 'path';

/**
 * The Master manager class.
 * @class
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
            shards: Config.shards[process.env.NODE_ENV ?? `dev`],
            shardsPerCluster: Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
            token: process.env.BOT_TOKEN ?? ``
        });

        // Check headers.
        checkEnvHeaders(this);

        // Start master.
        this.start().catch((error) => this.log(error));

        // On ready.
        this.once(`READY`, () => {
            // Run stats checkups at a set interval.
            statsCheckup(this).catch((error) => this.log(error));
            setInterval(() => void (async () => await statsCheckup(this).catch((error) => this.log(error)))(), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);

            // Log ready.
            this.log(`\x1b[35mBot up since ${new Date().toLocaleString()}`);
        });
    }
};
