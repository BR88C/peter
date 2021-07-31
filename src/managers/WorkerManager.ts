import { bindLavalinkEvents } from '../utils/Lavalink';
import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { logError } from '../utils/Log';
import { removeToken } from '../utils/StringUtils';
import { setRandomPresence } from '../utils/ProcessUtils';

// Import modules.
import { Collection } from '@discordjs/collection';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { LavalinkManager, PlayerState } from '@discord-rose/lavalink';
import { MongoClient } from 'mongodb';
import { PermissionsUtils, Worker } from 'discord-rose';
import { readdirSync, statSync } from 'fs';
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
     * The worker's lavalink manager.
     */
    public lavalink: LavalinkManager
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

        // Create the lavalink manager.
        this.lavalink = new LavalinkManager({
            defaultSource: `youtube`,
            enabledSources: [`youtube`],
            nodeOptions: Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            },
            defaultSpotifyRequestOptions: { agent: (_parsedURL) => {
                // @ts-expect-error Argument of type '{ family: number; }' is not assignable to parameter of type 'AgentOptions'.
                if (_parsedURL.protocol === `http:`) return new HttpAgent({ family: 4 });
                // @ts-expect-error Argument of type '{ family: number; }' is not assignable to parameter of type 'AgentOptions'.
                else return new HttpsAgent({ family: 4 });
            } }
        }, this);

        // Set presence, and change it at an interval specified in config.
        setRandomPresence(this);
        setInterval(() => setRandomPresence(this), Config.presenceInterval);

        // Set prefix.
        this.commands.prefix(Config.developerPrefix);
        this.log(`Using developer prefix ${Config.developerPrefix}`);

        // Push all commands to the worker.
        for (const dir of readdirSync(`./dist/commands`).filter((file) => statSync(`./dist/commands/${file}`).isDirectory())) {
            this.commands.load(resolve(__dirname, `../commands/${dir}`));
            for (const command of readdirSync(`./dist/commands/${dir}`).filter((file) => statSync(`./dist/commands/${dir}/${file}`).isFile()).map((file) => file.replace(`.js`, ``))) {
                if (this.commands.commands?.get(command)) this.commands.commands.get(command)!.category = dir;
            }
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);

        // Custom command error response.
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction) this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Command: ${ctx.ran} | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.interaction?.guild_id ? ` | Guild ID: ${ctx.interaction.guild_id}` : ``}`);
            else this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Command: ${ctx.command?.command} | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message?.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);

            if (!error.nonFatal) {
                logError(error);
                error.message = `An unkown error occurred. Please submit an issue in our support server.`;
            }

            ctx.embed
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${removeToken(error.message.replace(/^(Error: )/, ``))}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
                .send(true, false, true)
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });

        // Create command middleware.
        this.commands.middleware(async (ctx) => {
            if (!this.available) { // If the worker is not available.
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
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            } else { // If the received event is an interaction.
                ctx.player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
                if (ctx.command.mustBePaused && ctx.player?.state !== PlayerState.PAUSED) {
                    void ctx.error(`The music must be paused to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.mustBePlaying && (ctx.player?.state !== PlayerState.PLAYING || ctx.player?.queuePosition === null)) {
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
                if (ctx.command.userMustBeInSameVC && (!ctx.player || ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id))?.channel_id !== ctx.player.options.voiceChannelId)) {
                    void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }
                if (ctx.command.userMustBeInVC && !ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id))) {
                    void ctx.error(`You must be in a voice channel to run the "${ctx.command.interaction!.name}" command.`);
                    return false;
                }

                if (ctx.command.category === `music`) { // If the interaction is a music command.
                    const guildDocument = await this.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                    if (guildDocument?.djCommands.includes(ctx.command.interaction!.name.toLowerCase())) {
                        const voiceChannel = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!)?.options.voiceChannelId ?? ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id))?.channel_id;
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

                this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild ID: ${ctx.interaction.guild_id}`);
                return true;
            }
        });

        // On ready.
        this.on(`READY`, async () => {
            if (!this.available) {
                // Spawn lavalink nodes.
                this.log(`Spawning Lavalink Nodes`);
                const lavalinkStart = Date.now();
                const lavalinkSpawnResult = await this.lavalink.connectNodes();
                this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
                if (!this.lavalink.nodes.size) this.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);

                // Bind lavalink events.
                bindLavalinkEvents(this);

                // Destroy players that aren't 24/7 when no users are in the voice channel.
                this.on(`VOICE_STATE_UPDATE`, async (data) => {
                    const player = data.guild_id ? this.lavalink.players.get(data.guild_id) : undefined;
                    if (!player || player.twentyfourseven) return;
                    const voiceState = this.voiceStates.get(player.options.voiceChannelId);
                    if (voiceState?.users.has(this.user.id) && voiceState.users.size <= Config.maxUncheckedVoiceStateUsers) {
                        let nonBots = 0;
                        for (const [id] of voiceState.users) nonBots += (await this.api.users.get(id)).bot ? 0 : 1;
                        if (nonBots === 0) void player.destroy(`No other users in the voice channel`);
                    }
                });

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
