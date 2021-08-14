import { ButtonManager } from './ButtonManager';
import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { LavalinkManager } from './LavalinkManager';
import { Presences } from '../config/Presences';

// Import modules.
import { Collection } from '@discordjs/collection';
import { errorFunction, loadCommands, logError, setRandomPresence } from '@br88c/discord-utils';
import { MongoClient } from 'mongodb';
import { PermissionsUtils, Worker } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';
import { resolve } from 'path';

/**
 * The Worker manager class.
 * @class
 * @extends Worker
 */
export class WorkerManager extends Worker {
    /**
     * If the worker is available.
     */
    public available = false
    /**
     * The worker's button manager.
     */
    public buttons: ButtonManager = new ButtonManager(this)
    /**
     * The worker's lavalink manager.
     */
    public lavalink: LavalinkManager = new LavalinkManager(this)
    /**
     * The worker's MongoDB client.
     */
    public mongoClient: MongoClient = new MongoClient(Config.mongo.url)

    /**
     * Create the Worker manager.
     * @constructor
     */
    constructor () {
        super();

        // Set presence, and change it at an interval specified in config.
        setRandomPresence(this, Presences);
        setInterval(() => setRandomPresence(this, Presences), Config.presenceInterval);

        // Set prefix.
        this.commands.prefix(Config.developerPrefix);
        this.log(`Using developer prefix ${Config.developerPrefix}`);

        // Load commands.
        loadCommands(this, resolve(__dirname, `../commands`));

        // Custom command error response.
        this.commands.error((ctx, error) => errorFunction(ctx, error, this, Config.defaultTokenArray, Constants.ERROR_EMBED_COLOR, Constants.SUPPORT_SERVER));

        // Create command middleware.
        this.commands.middleware(async (ctx) => {
            if (!ctx.worker.available) { // If the worker is not available.
                void ctx.error(`The bot is still starting; please wait!`);
                return false;
            }
            if (!ctx.isInteraction) { // If the received event is not an interaction.
                if (!Config.devs.IDs.includes(ctx.author.id)) { // If the user is not a dev, return an error.
                    void ctx.error(`Peter's prefix commands (sudo) have been replaced by slash commands. For more information, join our support server!`);
                    return false;
                } else { // If the user is a dev.
                    if (ctx.command.interaction) { // If the command is a slash command, return.
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    } else { // If the command is not a slash command, execute it.
                        ctx.worker.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            } else { // If the received event is an interaction.
                ctx.player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
                ctx.voiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
                // @ts-expect-error This condition will always return 'true' since the types 'InteractionType.ApplicationCommand' and '3' have no overlap.
                if (!ctx.command.allowButton && ctx.interaction.type === 3) {
                    void ctx.error(`An internal button error occured. Please submit an issue in our support server.`);
                    return false;
                }
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
                if (ctx.command.userMustBeInSameVC && (!ctx.player || ctx.voiceState?.channel_id !== ctx.player.options.voiceChannelId)) {
                    void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.userMustBeInVC && !ctx.voiceState) {
                    void ctx.error(`You must be in a voice channel to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.voteLocked && !(await ctx.worker.comms.sendCommand(`CHECK_VOTE`, ctx.author.id))) {
                    await ctx.embed
                        .color(Constants.ERROR_EMBED_COLOR)
                        .title(`You must vote to use this command! Please vote by going to the link below.`)
                        .description(Constants.VOTE_LINK)
                        .send(true, false, true)
                        .catch(() => void ctx.error(`Unable to send the response message.`));
                    return false;
                }
        
                if (ctx.command.category === `music`) { // If the interaction is a music command.
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
                }
        
                ctx.worker.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild ID: ${ctx.interaction.guild_id}`);
                await ctx.typing().catch(() => void ctx.error(`Unable to send thinking response.`));
                return true;
            }
        });

        // On ready.
        this.on(`READY`, async () => {
            if (!this.available) {
                // Initiate lavalink.
                await this.lavalink.init();

                // Connect to Mongo DB.
                await this.mongoClient.connect().catch((error) => logError(error));
                this.log(`Connected to MongoDB`);

                // Set worker to available.
                this.available = true;
            }

            // Log worker up.
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
        });
    }
}
