"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../config/Config"));
const Constants_1 = __importDefault(require("../config/Constants"));
const Tokens_1 = require("../utils/Tokens");
const Lavalink_1 = __importDefault(require("./Lavalink"));
const Presences_1 = __importDefault(require("../config/Presences"));
const collection_1 = require("@discordjs/collection");
const mongodb_1 = require("mongodb");
const discord_rose_1 = require("discord-rose");
const lavalink_1 = require("@discord-rose/lavalink");
const path_1 = require("path");
const discord_utils_1 = require("@br88c/discord-utils");
class WorkerManager extends discord_utils_1.WorkerManager {
    constructor() {
        super({
            commandHandler: {
                allowedTypes: {
                    interactions: `all`,
                    prefix: `devs`
                },
                devs: Config_1.default.devs.IDs,
                errorEmbedColor: Constants_1.default.ERROR_EMBED_COLOR,
                location: (0, path_1.resolve)(__dirname, `../commands`),
                prefix: Config_1.default.developerPrefix
            },
            presence: {
                interval: Config_1.default.presenceInterval,
                presences: Presences_1.default
            },
            readyCallback: async () => {
                await this.lavalink.init().catch((error) => discord_utils_1.Utils.logError(error));
                await this.mongoClient.connect().catch((error) => discord_utils_1.Utils.logError(error));
                this.log(`Connected to MongoDB`);
            },
            tokenFilter: Tokens_1.defaultTokenArray
        });
        this.lavalink = new Lavalink_1.default(this);
        this.mongoClient = new mongodb_1.MongoClient(Config_1.default.mongo.url);
        this.commands.middleware(async (ctx) => {
            ctx.player = ctx.worker.lavalink.players.get((ctx.isInteraction ? ctx.interaction : ctx.message).guild_id);
            ctx.voiceState = ctx.worker.voiceStates.find((state) => state.guild_id === (ctx.isInteraction ? ctx.interaction : ctx.message).guild_id && state.users.has(ctx.author.id));
            if (ctx.isInteraction) {
                await ctx.typing().catch((error) => {
                    discord_utils_1.Utils.logError(error);
                    void ctx.error(`Unable to send thinking response.`);
                });
                if (ctx.command.mustBePaused && ctx.player?.state !== lavalink_1.PlayerState.PAUSED) {
                    void ctx.error(`The music must be paused to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.mustBePausedOrPlaying && (ctx.player?.state ?? 0) < lavalink_1.PlayerState.PAUSED) {
                    void ctx.error(`The music must be paused or playing to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.mustBePlaying && (ctx.player?.state !== lavalink_1.PlayerState.PLAYING || ctx.player?.queuePosition === null || !ctx.player?.currentTrack)) {
                    void ctx.error(`The bot must be playing music to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHaveConnectedPlayer && (ctx.player?.state ?? 0) < lavalink_1.PlayerState.CONNECTED) {
                    void ctx.error(`The bot must be connected to the voice channel to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHavePlayer && !ctx.player) {
                    void ctx.error(`The bot must be connecting or connected to the voice channel to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHaveTracksInQueue && !ctx.player?.queue.length) {
                    void ctx.error(`There must be music in the queue to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.userMustBeInSameVC && !ctx.voiceState?.users.has(this.user.id)) {
                    void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.userMustBeInVC && !ctx.voiceState) {
                    void ctx.error(`You must be in a voice channel to run the "${ctx.command.interaction.name}" command.`);
                    return false;
                }
                if (ctx.command.voteLocked && !(await ctx.worker.comms.sendCommand(`CHECK_VOTE`, ctx.author.id).catch((error) => {
                    discord_utils_1.Utils.logError(error);
                    return true;
                }))) {
                    await ctx.embed
                        .color(Constants_1.default.ERROR_EMBED_COLOR)
                        .title(`You must vote to use this command! Please vote by going to the link below.`)
                        .description(Config_1.default.voteLink)
                        .send(true, false, true)
                        .catch((error) => {
                        discord_utils_1.Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
                    return false;
                }
                if (ctx.command.category === `music`) {
                    try {
                        const guildDocument = await ctx.worker.mongoClient.db(Config_1.default.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                        if (guildDocument?.djCommands.includes(ctx.command.interaction.name.toLowerCase())) {
                            const voiceChannel = ctx.worker.lavalink.players.get(ctx.interaction.guild_id)?.options.voiceChannelId ?? ctx.voiceState?.channel_id;
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
                    catch (error) {
                        discord_utils_1.Utils.logError(error);
                    }
                }
            }
            return true;
        });
    }
}
exports.default = WorkerManager;
