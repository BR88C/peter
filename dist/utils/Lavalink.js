"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtersString = exports.bindLavalinkEvents = void 0;
const StringUtils_1 = require("./StringUtils");
const Constants_1 = require("../config/Constants");
const discord_rose_1 = require("discord-rose");
const bindLavalinkEvents = (worker) => {
    worker.lavalink.on(`NODE_CONNECTED`, (node) => worker.log(`Node Connected | Node ID: ${node.identifier}`));
    worker.lavalink.on(`NODE_CREATED`, (node) => worker.log(`Node Created | Node ID: ${node.identifier}`));
    worker.lavalink.on(`NODE_DESTROYED`, ({ node, reason }) => worker.log(`\x1b[31mNode Destroyed | Node ID: ${node.identifier} | Reason: ${reason}`));
    worker.lavalink.on(`NODE_DISCONNECTED`, ({ node, code, reason }) => worker.log(`\x1b[31mNode Disconnected | Node ID: ${node.identifier} | Code: ${code} | Reason: ${reason}`));
    worker.lavalink.on(`NODE_ERROR`, ({ node, error }) => worker.log(`\x1b[31mNode Error | Node ID: ${node.identifier} | Error: ${error?.message ?? error}`));
    worker.lavalink.on(`NODE_RECONNECTING`, (node) => worker.log(`\x1b[33mNode Reconnecting | Node ID: ${node.identifier}`));
    worker.lavalink.on(`PLAYER_CONNECTED`, (player) => worker.log(`Player Connected | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_CREATED`, (player) => worker.log(`Player Created | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_DESTROYED`, ({ player, reason }) => {
        worker.log(`\x1b[31mPlayer Destroyed | Reason: ${reason} | Guild ID: ${player.options.guildId}`);
        if (reason === `No other users in the voice channel`)
            void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
                .color(Constants_1.Constants.LEAVE_EMBED_COLOR)
                .title(`:wave:  Left the voice channel due to no other users being present`));
        else if (reason === `Player was moved out of the voice channel`)
            void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
                .color(Constants_1.Constants.LEAVE_EMBED_COLOR)
                .title(`Destroyed the queue due to being moved out of the voice channel.`));
        else if (reason !== `Manual destroy`)
            void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unkown error occurred while playing music, causing the queue to be destroyed. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
                .timestamp());
    });
    worker.lavalink.on(`PLAYER_ERROR`, ({ player, error }) => {
        worker.log(`\x1b[31mPlayer Error | Error: ${error?.message ?? error} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
            .color(Constants_1.Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
            .timestamp());
    });
    worker.lavalink.on(`PLAYER_MOVED`, ({ player }) => worker.log(`Player Moved | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_PAUSED`, ({ player, reason }) => worker.log(`Player Paused | Reason: ${reason} | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_RESUMED`, ({ player, reason }) => worker.log(`Player Resumed | Reason: ${reason} | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_TRACK_END`, ({ player, track, reason }) => worker.log(`Track Ended | Track Identifier: ${track?.identifier ?? `N/A`} | Reason: ${reason} | Guild ID: ${player.options.guildId}`));
    worker.lavalink.on(`PLAYER_TRACK_EXCEPTION`, ({ player, track, message, severity, cause }) => {
        worker.log(`\x1b[31mTrack Exception | Track Identifier: ${track?.identifier ?? `N/A`} | Severity: ${severity} | Cause: ${cause} | Message: ${message} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
            .color(Constants_1.Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
            .timestamp());
    });
    worker.lavalink.on(`PLAYER_TRACK_START`, ({ player, track }) => {
        worker.log(`Track Started | Track Identifier: ${track?.identifier ?? `N/A`} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
            .color(Constants_1.Constants.STARTED_PLAYING_EMBED_COLOR)
            .title(`Started playing: ${StringUtils_1.cleanseMarkdown(track?.title ?? `N/A`)}`)
            .description(`**Link:** ${track?.uri ?? `N/A`}`)
            .image(`${track?.thumbnail(`mqdefault`)}`)
            .footer(`Requested by ${track?.requester ?? `N/A`}`)
            .timestamp());
    });
    worker.lavalink.on(`PLAYER_TRACK_STUCK`, ({ player, track }) => {
        worker.log(`\x1b[33mTrack Stuck | Track Identifier: ${track?.identifier ?? `N/A`} | Guild ID: ${player.options.guildId}`);
        void worker.api.messages.send(player.options.textChannelId, new discord_rose_1.Embed()
            .color(Constants_1.Constants.ERROR_EMBED_COLOR)
            .title(`Error`)
            .description(`\`\`\`\nAn unkown error occurred while playing music. Please submit an issue in our support server.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
            .timestamp());
    });
    worker.lavalink.on(`SPOTIFY_AUTHORIZED`, ({ expiresIn }) => worker.log(`Spotify Authorized | Expires at: ${new Date(Date.now() + expiresIn).toLocaleString()}`));
    worker.lavalink.on(`SPOTIFY_AUTH_ERROR`, (error) => worker.log(`\x1b[31mError Authorizing Spotify | Error: ${error.message}`));
};
exports.bindLavalinkEvents = bindLavalinkEvents;
const filtersString = (player) => {
    const prettyFilters = [];
    if (player.filters.equalizer?.find((v) => v.band === 0))
        prettyFilters.push(`Bassboost = +${Math.round((player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants_1.Constants.BASSBOOST_INTENSITY_MULTIPLIER)}`);
    if (typeof player.filters.timescale?.pitch === `number`)
        prettyFilters.push(`Pitch = ${Math.round(player.filters.timescale.pitch * 100)}﹪`);
    if (typeof player.filters.rotation?.rotationHz === `number`)
        prettyFilters.push(`Rotation = ${player.filters.rotation.rotationHz} Hz`);
    if (typeof player.filters.timescale?.speed === `number`)
        prettyFilters.push(`Speed = ${Math.round(player.filters.timescale.speed * 100)}﹪`);
    if (player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1))
        prettyFilters.push(`Treble = +${Math.round((player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants_1.Constants.TREBLE_INTENSITY_MULTIPLIER)}`);
    if (typeof player.filters.tremolo?.depth === `number`)
        prettyFilters.push(`Tremolo = ${Math.round(player.filters.tremolo.depth * 100)}﹪`);
    if (typeof player.filters.vibrato?.depth === `number`)
        prettyFilters.push(`Vibrato = ${Math.round(player.filters.vibrato.depth * 100)}﹪`);
    if (player.volume !== 100)
        prettyFilters.push(`Volume = ${player.volume}﹪`);
    return prettyFilters.length ? `\`\`\`prolog\n${prettyFilters.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
};
exports.filtersString = filtersString;
