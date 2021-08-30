import Config from '../config/Config';
import Constants from '../config/Constants';

// Import modules.
import { cleanseMarkdown, logError } from '@br88c/discord-utils';
import { Embed, Worker } from 'discord-rose';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { LavalinkManager as Manager, Player } from '@discord-rose/lavalink';

export class ExtendedPlayer extends Player {
    /**
     * If the player should stay in the voice channel after all users leave.
     */
    twentyfourseven: boolean
}

export default class LavalinkManager extends Manager {
    constructor(worker: Worker) {
        super({
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
        }, worker);

        this.on(`NODE_CONNECTED`, (node) => worker.log(`Node Connected | Node ID: ${node.identifier}`));

        this.on(`NODE_CREATED`, (node) => worker.log(`Node Created | Node ID: ${node.identifier}`));

        this.on(`NODE_DESTROYED`, ({
            node, reason
        }) => worker.log(`\x1b[31mNode Destroyed | Node ID: ${node.identifier} | Reason: ${reason}`));

        this.on(`NODE_DISCONNECTED`, ({
            node, code, reason
        }) => worker.log(`\x1b[31mNode Disconnected | Node ID: ${node.identifier} | Code: ${code} | Reason: ${reason}`));

        this.on(`NODE_ERROR`, ({
            node, error
        }) => worker.log(`\x1b[31mNode Error | Node ID: ${node.identifier} | Error: ${error?.message ?? error}`));

        this.on(`NODE_RECONNECTING`, (node) => worker.log(`\x1b[33mNode Reconnecting | Node ID: ${node.identifier}`));

        this.on(`PLAYER_CONNECTED`, (player) => worker.log(`Player Connected | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_CREATED`, (player) => worker.log(`Player Created | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_DESTROYED`, ({
            player, reason
        }) => {
            worker.log(`\x1b[31mPlayer Destroyed | Reason: ${reason} | Guild ID: ${player.options.guildId}`);
            if (reason === `No other users in the voice channel`) worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.LEAVE_EMBED_COLOR)
                .title(`:wave:  Left the voice channel due to no other users being present`)
            ).catch(() => {});
            else if (reason === `Player was moved out of the voice channel`) worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.LEAVE_EMBED_COLOR)
                .title(`Destroyed the queue due to being moved out of the voice channel.`)
            ).catch(() => {});
            else if (reason !== `Manual destroy`) worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unkown error occurred while playing music, causing the queue to be destroyed. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
            ).catch(() => {});
        });

        this.on(`PLAYER_ERROR`, ({
            player, error
        }) => {
            worker.log(`\x1b[31mPlayer Error | Error: ${error?.message ?? error} | Guild ID: ${player.options.guildId}`);
            worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
            ).catch(() => {});
        });

        this.on(`PLAYER_MOVED`, ({ player }) => worker.log(`Player Moved | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_PAUSED`, ({
            player, reason
        }) => worker.log(`Player Paused | Reason: ${reason} | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_RESUMED`, ({
            player, reason
        }) => worker.log(`Player Resumed | Reason: ${reason} | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_TRACK_END`, ({
            player, track, reason
        }) => worker.log(`Track Ended | Track Identifier: ${track?.identifier ?? `N/A`} | Reason: ${reason} | Guild ID: ${player.options.guildId}`));

        this.on(`PLAYER_TRACK_EXCEPTION`, ({
            player, track, message, severity, cause
        }) => {
            worker.log(`\x1b[31mTrack Exception | Track Identifier: ${track?.identifier ?? `N/A`} | Severity: ${severity} | Cause: ${cause} | Message: ${message} | Guild ID: ${player.options.guildId}`);
            worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
            ).catch(() => {});
        });

        this.on(`PLAYER_TRACK_START`, ({
            player, track
        }) => {
            worker.log(`Track Started | Track Identifier: ${track?.identifier ?? `N/A`} | Guild ID: ${player.options.guildId}`);
            worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                .title(`Started playing: ${cleanseMarkdown(track?.title ?? `N/A`)}`)
                .description(`**Link:** ${track?.uri ?? `N/A`}`)
                .image(`${track?.thumbnail(`mqdefault`)}`)
                .footer(`Requested by ${track?.requester ?? `N/A`}`)
                .timestamp()
            ).catch(() => {});
        });

        this.on(`PLAYER_TRACK_STUCK`, ({
            player, track 
        }) => {
            worker.log(`\x1b[33mTrack Stuck | Track Identifier: ${track?.identifier ?? `N/A`} | Guild ID: ${player.options.guildId}`);
            worker.api.messages.send(player.options.textChannelId, new Embed()
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
            ).catch(() => {});
        });

        this.on(`SPOTIFY_AUTHORIZED`, ({ expiresIn }) => worker.log(`Spotify Authorized | Expires at: ${new Date(Date.now() + expiresIn).toLocaleString()}`));

        this.on(`SPOTIFY_AUTH_ERROR`, (error) => worker.log(`\x1b[31mError Authorizing Spotify | Error: ${error.message}`));
    }

    /**
     * Initiate the lavalink manager.
     */
    public async init (): Promise<void> {
        this.worker.log(`Spawning Lavalink Nodes`);
        const lavalinkStart = Date.now();
        const lavalinkSpawnResult = await this.connectNodes().catch((error) => logError(error));
        this.worker.log(`Spawned ${lavalinkSpawnResult ? lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length : 0}/${this.options.nodeOptions.length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
        if (!this.nodes.size) this.worker.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);

        this.worker.on(`VOICE_STATE_UPDATE`, async (data) => {
            const player = data.guild_id ? this.players.get(data.guild_id) : undefined;
            if (!player || player.twentyfourseven) return;
            const voiceState = this.worker.voiceStates.get(player.options.voiceChannelId);
            if (voiceState?.users.has(this.worker.user.id) && voiceState.users.size <= Config.maxUncheckedVoiceStateUsers) {
                let nonBots = 0;
                for (const [id] of voiceState.users) nonBots += (await this.worker.api.users.get(id).catch((error) => logError(error)))?.bot ? 0 : 1;
                if (nonBots === 0) void player.destroy(`No other users in the voice channel`);
            }
        });
    }

    /**
     * Create a pretty string showing all filters active on a player.
     * @param player The player to pull filters from.
     * @returns The pretty string.
     */
    public filtersString (player: Player): string {
        const prettyFilters: string[] = [];
        if (player.filters.equalizer?.find((v) => v.band === 0)) prettyFilters.push(`Bassboost = +${Math.round((player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants.BASSBOOST_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.timescale?.pitch === `number`) prettyFilters.push(`Pitch = ${Math.round(player.filters.timescale.pitch * 100)}﹪`);
        if (typeof player.filters.rotation?.rotationHz === `number`) prettyFilters.push(`Rotation = ${player.filters.rotation.rotationHz} Hz`);
        if (typeof player.filters.timescale?.speed === `number`) prettyFilters.push(`Speed = ${Math.round(player.filters.timescale.speed * 100)}﹪`);
        if (player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)) prettyFilters.push(`Treble = +${Math.round((player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants.TREBLE_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.tremolo?.depth === `number`) prettyFilters.push(`Tremolo = ${Math.round(player.filters.tremolo.depth * 100)}﹪`);
        if (typeof player.filters.vibrato?.depth === `number`) prettyFilters.push(`Vibrato = ${Math.round(player.filters.vibrato.depth * 100)}﹪`);
        if (player.volume !== 100) prettyFilters.push(`Volume = ${player.volume}﹪`);
        return prettyFilters.length ? `\`\`\`prolog\n${prettyFilters.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
    }
}
