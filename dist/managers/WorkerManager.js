"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Lavalink_1 = require("../utils/Lavalink");
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const Middleware_1 = require("../utils/Middleware");
const Presences_1 = require("../config/Presences");
const discord_utils_1 = require("@br88c/discord-utils");
const http_1 = require("http");
const https_1 = require("https");
const lavalink_1 = require("@discord-rose/lavalink");
const mongodb_1 = require("mongodb");
const discord_rose_1 = require("discord-rose");
class WorkerManager extends discord_rose_1.Worker {
    constructor() {
        super();
        this.available = false;
        this.mongoClient = new mongodb_1.MongoClient(Config_1.Config.mongo.url);
        this.lavalink = new lavalink_1.LavalinkManager({
            defaultSource: `youtube`,
            enabledSources: [`youtube`],
            nodeOptions: Config_1.Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            },
            defaultSpotifyRequestOptions: { agent: (_parsedURL) => {
                    if (_parsedURL.protocol === `http:`)
                        return new http_1.Agent({ family: 4 });
                    else
                        return new https_1.Agent({ family: 4 });
                } }
        }, this);
        discord_utils_1.setRandomPresence(this, Presences_1.Presences);
        setInterval(() => discord_utils_1.setRandomPresence(this, Presences_1.Presences), Config_1.Config.presenceInterval);
        this.commands.prefix(Config_1.Config.developerPrefix);
        this.log(`Using developer prefix ${Config_1.Config.developerPrefix}`);
        discord_utils_1.loadCommands(this, `../commands`);
        this.commands.error((ctx, error) => discord_utils_1.errorFunction(ctx, error, this, Config_1.Config.defaultTokenArray, Constants_1.Constants.ERROR_EMBED_COLOR, Constants_1.Constants.SUPPORT_SERVER));
        this.commands.middleware(async (ctx) => Middleware_1.Middleware(ctx));
        this.on(`READY`, async () => {
            if (!this.available) {
                this.log(`Spawning Lavalink Nodes`);
                const lavalinkStart = Date.now();
                const lavalinkSpawnResult = await this.lavalink.connectNodes();
                this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
                if (!this.lavalink.nodes.size)
                    this.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);
                Lavalink_1.bindLavalinkEvents(this);
                this.on(`VOICE_STATE_UPDATE`, async (data) => {
                    const player = data.guild_id ? this.lavalink.players.get(data.guild_id) : undefined;
                    if (!player || player.twentyfourseven)
                        return;
                    const voiceState = this.voiceStates.get(player.options.voiceChannelId);
                    if (voiceState?.users.has(this.user.id) && voiceState.users.size <= Config_1.Config.maxUncheckedVoiceStateUsers) {
                        let nonBots = 0;
                        for (const [id] of voiceState.users)
                            nonBots += (await this.api.users.get(id)).bot ? 0 : 1;
                        if (nonBots === 0)
                            void player.destroy(`No other users in the voice channel`);
                    }
                });
                await this.mongoClient.connect().catch((error) => discord_utils_1.logError(error));
                this.log(`Connected to MongoDB`);
                this.available = true;
            }
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
        });
    }
}
exports.WorkerManager = WorkerManager;
