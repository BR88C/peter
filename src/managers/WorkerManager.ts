import { cleanseMarkdown, removeToken } from '../utils/StringUtils';
import { Config } from '../config/Config';
import { Constants } from '../config/Constants';

import { setRandomPresence } from '../utils/ProcessUtils';

// Import modules.
import { LavalinkManager, Track } from '@discord-rose/lavalink';
import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { Embed, Worker } from 'discord-rose';

/**
 * The Worker manager class.
 * @class
 * @extends Worker
 */
export class WorkerManager extends Worker {
    /**
     * The worker's lavalink manager.
     */
    public lavalink: LavalinkManager

    /**
     * Create the Worker manager.
     * @constructor
     */
    constructor () {
        super();

        this.lavalink = new LavalinkManager({
            nodeOptions: Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            }
        }, this);

        // Set presence, and change it at an interval specified in config.
        setRandomPresence(this);
        setInterval(() => setRandomPresence(this), Config.presenceInterval);

        // Set prefix.
        this.commands.prefix(Config.developerPrefix);
        this.log(`Using developer prefix ${Config.developerPrefix}`);

        // Push all commands to the worker.
        for (const dir of readdirSync(`./src/commands`).filter((file) => statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) {
            this.commands.load(resolve(__dirname, `../commands/${dir}`));
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);

        // Custom command error response.
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction) this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
            else this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.command?.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);

            if (!error.nonFatal) {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
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
        this.commands.middleware((ctx) => {
            if (!ctx.isInteraction) { // If the received event is not an interaction.
                if (!Config.devs.IDs.includes(ctx.author.id)) { // If the user is not a dev, return an error.
                    this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                    void ctx.error(`Prefix commands are now depreciated, please use slash commands instead. For more information, join our support server!`);
                    return false;
                } else { // If the user is a dev.
                    if (ctx.command.interaction != null) { // If the command is a slash command, return.
                        this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    } else { // If the command is not a slash command, execute it.
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            } else { // If the received event is an interaction.
                if (!ctx.interaction.guild_id) {
                    this.log(`\x1b[33mReceived Interaction in a Guild | User: ${ctx.author.username}#${ctx.author.discriminator}`);
                    void ctx.error(`This command can only be ran in a guild!`);
                    return false;
                } else {
                    this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}`);
                    return true;
                }
            }
        });

        // On ready.
        this.on(`READY`, async () => {
            this.log(`Spawning Lavalink Nodes`);
            const lavalinkStart = Date.now();
            const lavalinkSpawnResult = await this.lavalink.connectNodes();
            this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);

            this.lavalink.on(`NODE_CONNECTED`, (node) => this.log(`Node Connected | Node ID: ${node.identifier}`));

            this.lavalink.on(`NODE_CREATED`, (node) => this.log(`Node Created | Node ID: ${node.identifier}`));

            this.lavalink.on(`NODE_DESTROYED`, ({
                node, reason
            }) => this.log(`\x1b[31mNode Destroyed | Node ID: ${node.identifier} | Reason: ${reason}`));

            this.lavalink.on(`NODE_DISCONNECTED`, ({
                node, code, reason
            }) => this.log(`\x1b[31mNode Disconnected | Node ID: ${node.identifier} | Code: ${code} | Reason: ${reason}`));

            this.lavalink.on(`NODE_ERROR`, ({
                node, error
            }) => this.log(`\x1b[31mNode Error | Node ID: ${node.identifier} | Error: ${error?.message ?? error}`));

            this.lavalink.on(`NODE_RECONNECTING`, (node) => this.log(`\x1b[33mNode Reconnecting | Node ID: ${node.identifier}`));

            this.lavalink.on(`PLAYER_CONNECTED`, (player) => this.log(`Player Connected | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_CREATED`, (player) => this.log(`Player Created | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_DESTROYED`, ({
                player, reason
            }) => {
                this.log(`\x1b[31mPlayer Destroyed | Reason: ${reason} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
                if (reason !== `Manual destroy`) void this.api.messages.send(player.options.textChannelId, new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nPlayer destroyed: ${reason}${reason.endsWith(`.`) ? `` : `.`}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                    .timestamp()
                );
            });

            this.lavalink.on(`PLAYER_ERROR`, ({
                player, error
            }) => {
                this.log(`\x1b[31mPlayer Error | Error: ${error?.message ?? error} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
                void this.api.messages.send(player.options.textChannelId, new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nAn unknown player error occurred\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                    .timestamp()
                );
            });

            this.lavalink.on(`PLAYER_MOVED`, ({
                player, newChannel
            }) => this.log(`Player Moved | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_PAUSED`, ({
                player, reason
            }) => this.log(`Player Paused | Reason: ${reason} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_RESUMED`, ({
                player, reason
            }) => this.log(`Player Resumed | Reason: ${reason} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_TRACK_END`, ({
                player, track, reason
            }) => this.log(`Track Ended | Track Identifier: ${track.identifier} | Reason: ${reason} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

            this.lavalink.on(`PLAYER_TRACK_EXCEPTION`, ({
                player, track, message, severity, cause
            }) => {
                this.log(`\x1b[31mTrack Exception | Track Identifier: ${track instanceof Track ? track.identifier : `N/A`} | Severity: ${severity} | Cause: ${cause} | Message: ${message} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
                void this.api.messages.send(player.options.textChannelId, new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nAn unknown track exception occurred\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                    .timestamp()
                );
            });

            this.lavalink.on(`PLAYER_TRACK_START`, ({
                player, track
            }) => {
                this.log(`Track Started | Track Identifier: ${track.identifier} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
                void this.api.messages.send(player.options.textChannelId, new Embed()
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Started playing: ${cleanseMarkdown(track.title)}`)
                    .description(`**Link:** ${track.uri}`)
                    .image(`${track.thumbnail(`mqdefault`)}`)
                    .footer(`Requested by ${track.requester}`)
                    .timestamp()
                );
            });

            this.lavalink.on(`PLAYER_TRACK_STUCK`, ({
                player, track, thresholdMs
            }) => {
                this.log(`\x1b[33mTrack Stuck | Track Identifier: ${track.identifier} | Guild Name: ${this.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
                void this.api.messages.send(player.options.textChannelId, new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nTrack stuck, skipping to the next queued track.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                    .timestamp()
                );
            });
        });
    }
}
