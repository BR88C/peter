import { cleanseMarkdown } from './StringUtils';
import { Constants } from '../config/Constants';
import { WorkerManager } from '../managers/WorkerManager';

// Import modules.
import { Player, Track } from '@discord-rose/lavalink';
import { Embed } from 'discord-rose';

/**
 * Bind lavalink events.
 * @param worker The worker the lavalink manager is on.
 */
export const bindLavalinkEvents = (worker: WorkerManager): void => {
    worker.lavalink.on(`NODE_CONNECTED`, (node) => worker.log(`Node Connected | Node ID: ${node.identifier}`));

    worker.lavalink.on(`NODE_CREATED`, (node) => worker.log(`Node Created | Node ID: ${node.identifier}`));

    worker.lavalink.on(`NODE_DESTROYED`, ({
        node, reason
    }) => worker.log(`\x1b[31mNode Destroyed | Node ID: ${node.identifier} | Reason: ${reason}`));

    worker.lavalink.on(`NODE_DISCONNECTED`, ({
        node, code, reason
    }) => worker.log(`\x1b[31mNode Disconnected | Node ID: ${node.identifier} | Code: ${code} | Reason: ${reason}`));

    worker.lavalink.on(`NODE_ERROR`, ({
        node, error
    }) => worker.log(`\x1b[31mNode Error | Node ID: ${node.identifier} | Error: ${error?.message ?? error}`));

    worker.lavalink.on(`NODE_RECONNECTING`, (node) => worker.log(`\x1b[33mNode Reconnecting | Node ID: ${node.identifier}`));

    worker.lavalink.on(`PLAYER_CONNECTED`, (player) => worker.log(`Player Connected | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_CREATED`, (player) => worker.log(`Player Created | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_DESTROYED`, ({
        player, reason
    }) => {
        worker.log(`\x1b[31mPlayer Destroyed | Reason: ${reason} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
        if (reason !== `Manual destroy`) void worker.api.messages.send(player.options.textChannelId, new Embed()
            .color(Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nPlayer destroyed: ${reason}${reason.endsWith(`.`) ? `` : `.`}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
            .timestamp()
        );
    });

    worker.lavalink.on(`PLAYER_ERROR`, ({
        player, error
    }) => {
        worker.log(`\x1b[31mPlayer Error | Error: ${error?.message ?? error} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new Embed()
            .color(Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nAn unknown player error occurred\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
            .timestamp()
        );
    });

    worker.lavalink.on(`PLAYER_MOVED`, ({
        player, newChannel
    }) => worker.log(`Player Moved | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_PAUSED`, ({
        player, reason
    }) => worker.log(`Player Paused | Reason: ${reason} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_RESUMED`, ({
        player, reason
    }) => worker.log(`Player Resumed | Reason: ${reason} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_TRACK_END`, ({
        player, track, reason
    }) => worker.log(`Track Ended | Track Identifier: ${track.identifier} | Reason: ${reason} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`));

    worker.lavalink.on(`PLAYER_TRACK_EXCEPTION`, ({
        player, track, message, severity, cause
    }) => {
        worker.log(`\x1b[31mTrack Exception | Track Identifier: ${track instanceof Track ? track.identifier : `N/A`} | Severity: ${severity} | Cause: ${cause} | Message: ${message} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new Embed()
            .color(Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nAn unknown track exception occurred\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
            .timestamp()
        );
    });

    worker.lavalink.on(`PLAYER_TRACK_START`, ({
        player, track
    }) => {
        worker.log(`Track Started | Track Identifier: ${track.identifier} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new Embed()
            .color(Constants.STARTED_PLAYING_EMBED_COLOR)
            .title(`Started playing: ${cleanseMarkdown(track.title)}`)
            .description(`**Link:** ${track.uri}`)
            .image(`${track.thumbnail(`mqdefault`)}`)
            .footer(`Requested by ${track.requester}`)
            .timestamp()
        );
    });

    worker.lavalink.on(`PLAYER_TRACK_STUCK`, ({
        player, track, thresholdMs
    }) => {
        worker.log(`\x1b[33mTrack Stuck | Track Identifier: ${track.identifier} | Guild Name: ${worker.guilds.get(player.options.guildId)?.name} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new Embed()
            .color(Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nTrack stuck, skipping to the next queued track.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
            .timestamp()
        );
    });
};

/**
 * Generate a filters string.
 * @param player The player to get filters from.
 * @returns The generated string.
 */
export const filtersString = (player: Player): string => {
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
};
