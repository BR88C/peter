"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Lavalink_1 = require("../utils/Lavalink");
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const Log_1 = require("../utils/Log");
const StringUtils_1 = require("../utils/StringUtils");
const ProcessUtils_1 = require("../utils/ProcessUtils");
const collection_1 = require("@discordjs/collection");
const http_1 = require("http");
const https_1 = require("https");
const lavalink_1 = require("@discord-rose/lavalink");
const mongodb_1 = require("mongodb");
const discord_rose_1 = require("discord-rose");
const fs_1 = require("fs");
const path_1 = require("path");
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
        ProcessUtils_1.setRandomPresence(this);
        setInterval(() => ProcessUtils_1.setRandomPresence(this), Config_1.Config.presenceInterval);
        this.commands.prefix(Config_1.Config.developerPrefix);
        this.log(`Using developer prefix ${Config_1.Config.developerPrefix}`);
        for (const dir of fs_1.readdirSync(`./dist/commands`).filter((file) => fs_1.statSync(`./dist/commands/${file}`).isDirectory())) {
            this.commands.load(path_1.resolve(__dirname, `../commands/${dir}`));
            for (const command of fs_1.readdirSync(`./dist/commands/${dir}`).filter((file) => fs_1.statSync(`./dist/commands/${dir}/${file}`).isFile()).map((file) => file.replace(`.js`, ``))) {
                if (this.commands.commands?.get(command))
                    this.commands.commands.get(command).category = dir;
            }
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction)
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Command: ${ctx.ran} | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.interaction?.guild_id ? ` | Guild ID: ${ctx.interaction.guild_id}` : ``}`);
            else
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Command: ${ctx.command?.command} | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message?.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);
            if (!error.nonFatal) {
                Log_1.logError(error);
                error.message = `An unkown error occurred. Please submit an issue in our support server.`;
            }
            ctx.embed
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
                .timestamp()
                .send(true, false, true)
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });
        this.commands.middleware(async (ctx) => {
            if (!this.available) {
                void ctx.error(`The bot is still starting; please wait!`);
                return false;
            }
            if (!ctx.isInteraction) {
                if (!Config_1.Config.devs.IDs.includes(ctx.author.id)) {
                    void ctx.error(`Peter's prefix commands (sudo) have been replaced by slash commands. For more information, join our support server!`);
                    return false;
                }
                else {
                    if (ctx.command.interaction) {
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    }
                    else {
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            }
            else {
                if (!ctx.interaction.guild_id || !ctx.interaction.member) {
                    void ctx.error(`That command can only be ran in a server!`);
                    return false;
                }
                else {
                    if (ctx.command.category === `music`) {
                        const guildDocument = await this.mongoClient.db(Config_1.Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                        if (guildDocument?.djCommands.includes(ctx.command.interaction.name.toLowerCase())) {
                            const voiceChannel = ctx.worker.lavalink.players.get(ctx.interaction.guild_id)?.options.voiceChannelId ?? ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id))?.channel_id;
                            if (voiceChannel && (ctx.worker.voiceStates.get(voiceChannel)?.users.size ?? 1) - 1 >= guildDocument.djOverride) {
                                const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id);
                                if (!discord_rose_1.PermissionsUtils.has(discord_rose_1.PermissionsUtils.combine({
                                    guild,
                                    member: ctx.interaction.member,
                                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new collection_1.Collection())
                                }), `manageGuild`) && !guild.roles.filter((role) => role.name.toLowerCase() === `dj`).map((role) => role.id).some((role) => ctx.interaction.member.roles.includes(role))) {
                                    void ctx.error(`You must have the DJ role to use that command.`);
                                    return false;
                                }
                            }
                        }
                    }
                    this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild ID: ${ctx.interaction.guild_id}`);
                    return true;
                }
            }
        });
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
                await this.mongoClient.connect().catch((error) => Log_1.logError(error));
                this.log(`Connected to MongoDB`);
                this.available = true;
            }
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
        });
    }
}
exports.WorkerManager = WorkerManager;
