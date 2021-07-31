"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterManager = void 0;
const Config_1 = require("../config/Config");
const Log_1 = require("../utils/Log");
const ProcessUtils_1 = require("../utils/ProcessUtils");
const sdk_1 = require("@top-gg/sdk");
const discord_rose_1 = require("discord-rose");
const path_1 = require("path");
class MasterManager extends discord_rose_1.Master {
    constructor() {
        super(path_1.resolve(__dirname, `./run/runWorker.js`), {
            cache: Config_1.Config.cache,
            cacheControl: Config_1.Config.cacheControl,
            log: Log_1.log,
            rest: { version: 9 },
            shards: Config_1.Config.shards[process.env.NODE_ENV ?? `dev`],
            shardsPerCluster: Config_1.Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
            token: process.env.BOT_TOKEN ?? ``
        });
        this.log(`\x1b[35mRunning in \x1b[33m${process.env.NODE_ENV ?? `dev`}\x1b[35m mode.`);
        this.start().catch((error) => Log_1.logError(error));
        if (process.env.TOPGG_TOKEN) {
            this.topgg = new sdk_1.Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        }
        else
            this.log(`No Top.gg token provided, skipping initialization`);
        this.handlers.on(`GET_VOTE`, async (cluster, data, resolve) => {
            const voted = this.topgg ? await this.topgg.hasVoted(data.user_id) : true;
            resolve(voted);
        });
        this.once(`READY`, () => {
            setInterval(() => void (async () => await ProcessUtils_1.statsCheckup(this).catch((error) => Log_1.logError(error)))(), Config_1.Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);
            this.log(`\x1b[35mMaster up since ${new Date().toLocaleString()}`);
        });
    }
}
exports.MasterManager = MasterManager;
