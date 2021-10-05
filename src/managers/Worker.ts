import Config from '../config/Config';
import Constants from '../config/Constants';
import { defaultTokenArray } from '../utils/Tokens';
import LavalinkManager from './Lavalink';
import Presences from '../config/Presences';

// Import modules.
import { Collection } from '@discordjs/collection';
import { MongoClient } from 'mongodb';
import { PermissionsUtils } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';
import { resolve } from 'path';
import { Utils, WorkerManager as Worker } from '@br88c/discord-utils';

export default class WorkerManager extends Worker {
    /**
     * The worker's MongoDB client.
     */
    public lavalink: LavalinkManager = new LavalinkManager(this)
    /**
     * The worker's MongoDB client.
     */
    public mongoClient: MongoClient = new MongoClient(Config.mongo.url)

    constructor () {
        super({
            commandHandler: {
                allowedTypes: {
                    interactions: `all`,
                    prefix: `devs`
                },
                devs: Config.devs.IDs,
                errorEmbedColor: Constants.ERROR_EMBED_COLOR,
                location: resolve(__dirname, `../commands`),
                prefix: Config.developerPrefix
            },
            presence: {
                interval: Config.presenceInterval,
                presences: Presences
            },
            readyCallback: async () => {
                // Initiate lavalink.
                await this.lavalink.init().catch((error) => Utils.logError(error));

                // Connect to Mongo DB.
                await this.mongoClient.connect().catch((error) => Utils.logError(error));
                this.log(`Connected to MongoDB`);
            },
            tokenFilter: defaultTokenArray
        });

        this.commands.middleware(async (ctx) => {
            ctx.player = ctx.worker.lavalink.players.get((ctx.isInteraction ? ctx.interaction : ctx.message).guild_id!);
            ctx.voiceState = ctx.worker.voiceStates.find((state) => state.guild_id === (ctx.isInteraction ? ctx.interaction : ctx.message).guild_id && state.users.has(ctx.author.id));
            
            if (ctx.isInteraction) {
                await ctx.typing().catch((error) => {
                    Utils.logError(error);
                    void ctx.error(`Unable to send thinking response.`);
                });
                if (ctx.command.mustBePaused && ctx.player?.state !== PlayerState.PAUSED) {
                    void ctx.error(`The music must be paused to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustBePausedOrPlaying && (ctx.player?.state ?? 0) < PlayerState.PAUSED) {
                    void ctx.error(`The music must be paused or playing to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustBePlaying && (ctx.player?.state !== PlayerState.PLAYING || ctx.player?.queuePosition === null || !ctx.player?.currentTrack)) {
                    void ctx.error(`The bot must be playing music to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHaveConnectedPlayer && (ctx.player?.state ?? 0) < PlayerState.CONNECTED) {
                    void ctx.error(`The bot must be connected to the voice channel to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHavePlayer && !ctx.player) {
                    void ctx.error(`The bot must be connecting or connected to the voice channel to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustHaveTracksInQueue && !ctx.player?.queue.length) {
                    void ctx.error(`There must be music in the queue to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if ((ctx.command.userMustBeInVC || ctx.command.userMustBeInSameVC) && !ctx.voiceState) {
                    void ctx.error(`You must be in a voice channel to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.userMustBeInSameVC && !ctx.voiceState?.users.has(this.user.id)) {
                    void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.voteLocked && !(await ctx.worker.comms.sendCommand(`CHECK_VOTE`, ctx.author.id).catch((error) => {
                    Utils.logError(error);
                    return true;
                }))) {
                    await ctx.embed
                        .color(Constants.ERROR_EMBED_COLOR)
                        .title(`You must vote to use this command! Please vote by going to the link below.`)
                        .description(Config.voteLink)
                        .send(true, false, true)
                        .catch((error) => {
                            Utils.logError(error);
                            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                        });
                    return false;
                }

                if (ctx.command.category === `music`) { // If the interaction is a music command.
                    try {
                        const guildDocument = await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                        if (guildDocument?.djCommands.includes(ctx.command.interaction!.name.toLowerCase())) {
                            const voiceChannel = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!)?.options.voiceChannelId ?? ctx.voiceState?.channel_id;
                            if (voiceChannel && (ctx.worker.voiceStates.get(voiceChannel)?.users.size ?? 1) - 1 >= guildDocument.djOverride) {
                                const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id!);
                                if (!PermissionsUtils.has(PermissionsUtils.combine({
                                    guild,
                                    member: ctx.interaction.member!,
                                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new Collection()) as any
                                }), `manageGuild`) && !guild.roles.filter((role) => role.name.toLowerCase() === `dj`).map((role) => role.id).some((role) => ctx.interaction.member!.roles.includes(role))) {
                                    void ctx.error(`You must have the DJ role to use that command.`);
                                    return false;
                                }
                            }
                        }
                    } catch (error) {
                        Utils.logError(error);
                    }
                }
            }

            return true;
        });
    }
}
