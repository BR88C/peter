"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterManager = void 0;
const Config_1 = require("../config/Config");
const sdk_1 = require("@top-gg/sdk");
const discord_utils_1 = require("@br88c/discord-utils");
const discord_rose_1 = require("discord-rose");
const path_1 = require("path");
const discord_utils_2 = require("@br88c/discord-utils");
class MasterManager extends discord_rose_1.Master {
    constructor() {
        super(path_1.resolve(__dirname, `./run/runWorker.js`), {
            cache: Config_1.Config.cache,
            cacheControl: Config_1.Config.cacheControl,
            log: discord_utils_1.log,
            rest: { version: 9 },
            shards: Config_1.Config.shards[process.env.NODE_ENV ?? `dev`],
            shardsPerCluster: Config_1.Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
            token: process.env.BOT_TOKEN ?? ``
        });
        this.log(`\x1b[35mRunning in \x1b[33m${process.env.NODE_ENV ?? `dev`}\x1b[35m mode.`);
        this.start().catch((error) => discord_utils_1.logError(error));
        if (process.env.TOPGG_TOKEN) {
            this.topgg = new sdk_1.Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        }
        else
            this.log(`No Top.gg token provided, skipping initialization`);
        this.handlers.on(`CHECK_VOTE`, async (cluster, data, resolve) => resolve(this.topgg ? await this.topgg.hasVoted(data) : true));
        this.once(`READY`, () => {
            setInterval(() => void (async () => {
                const stats = await discord_utils_2.statsCheckup(this).catch((error) => discord_utils_1.logError(error));
                if (stats && this.topgg)
                    this.topgg.postStats({ serverCount: stats.totalGuilds }).then(() => this.log(`Posted stats to Top.gg`)).catch(() => this.log(`Error posting stats to Top.gg`));
            })(), Config_1.Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);
            this.log(`\x1b[35mMaster up since ${new Date().toLocaleString()}`);
        });
    }
}
exports.MasterManager = MasterManager;
