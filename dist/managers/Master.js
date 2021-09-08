"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../config/Config"));
const sdk_1 = require("@top-gg/sdk");
const discord_utils_1 = require("@br88c/discord-utils");
const path_1 = require("path");
class MasterManager extends discord_utils_1.MasterManager {
    constructor() {
        super({
            botInfo: {
                inviteLink: Config_1.default.inviteLink,
                mode: process.env.NODE_ENV ?? `dev`,
                name: Config_1.default.botName,
                supportServer: Config_1.default.supportServer,
                website: Config_1.default.website
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
                token: process.env.BOT_TOKEN
            },
            statsOptions: {
                influx: process.env.INFLUX_TOKEN ? Object.assign(Config_1.default.influx, { token: process.env.INFLUX_TOKEN }) : undefined,
                interval: Config_1.default.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]
            },
            workerFile: (0, path_1.resolve)(__dirname, `./run/runWorker.js`)
        });
        if (process.env.TOPGG_TOKEN) {
            this.topgg = new sdk_1.Api(process.env.TOPGG_TOKEN);
            this.log(`Connected to Top.gg`);
        }
        else
            this.log(`No Top.gg token provided, skipping initialization`);
        this.handlers.on(`CHECK_VOTE`, async (cluster, data, resolve) => resolve(this.topgg ? await this.topgg.hasVoted(data).catch((error) => {
            discord_utils_1.Utils.logError(error);
            return true;
        }) : true));
        let topggPostInterval = 0;
        this.stats.on(`STATS`, (data) => {
            if (this.topgg) {
                topggPostInterval++;
                if (topggPostInterval % Config_1.default.topggPostInterval === 0)
                    this.topgg.postStats({ serverCount: data.shards.reduce((p, c) => p + c.guilds, 0) })
                        .then(() => this.log(`Posted stats to Top.gg`))
                        .catch((error) => discord_utils_1.Utils.logError(error));
            }
        });
    }
}
exports.default = MasterManager;
