"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const collection_1 = require("@discordjs/collection");
const discord_rose_1 = require("discord-rose");
const lavalink_1 = require("@discord-rose/lavalink");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `play`,
    userMustBeInVC: true,
    interaction: {
        name: `play`,
        description: `Plays a specified song or video, or adds it to the queue.`,
        options: [
            {
                type: 3,
                name: `query`,
                description: `A YouTube link, a Spotify link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.player && ctx.voiceState.channel_id !== ctx.player.options.voiceChannelId)
            return void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction.name}" command.`);
        await ctx.embed
            .color(Constants_1.default.PROCESSING_QUERY_EMBED_COLOR)
            .title(`:mag_right:  Searching...`)
            .send(true, false, true)
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
        const requesterTag = `${ctx.author.username}#${ctx.author.discriminator}`;
        const search = await ctx.worker.lavalink.search(ctx.options.query, ctx.member.nick ? `${ctx.member.nick} (${requesterTag})` : requesterTag).catch((error) => discord_utils_1.Utils.logError(error));
        if (!search)
            return void ctx.error(`An unknown search error occurred. Please submit an issue in our support server.`);
        if (search.exception) {
            ctx.worker.log(`\x1b[31mSearch Error | Error: ${search.exception.message} | Severity: ${search.exception.severity} | Guild ID: ${ctx.interaction.guild_id}`);
            return void ctx.error(`An unknown search error occurred. Please submit an issue in our support server.`);
        }
        if (!search.tracks[0] || search.loadType === `LOAD_FAILED` || search.loadType === `NO_MATCHES`)
            return void ctx.error(`Unable to find any results based on the provided query.`);
        let player;
        if (ctx.player)
            player = ctx.player;
        else {
            const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id).catch((error) => discord_utils_1.Utils.logError(error));
            const botMember = await ctx.worker.api.members.get(ctx.interaction.guild_id, ctx.worker.user.id).catch((error) => discord_utils_1.Utils.logError(error));
            const voiceChannel = await ctx.worker.api.channels.get(ctx.voiceState.channel_id).catch((error) => discord_utils_1.Utils.logError(error));
            const textChannel = await ctx.worker.api.channels.get(ctx.interaction.channel_id).catch((error) => discord_utils_1.Utils.logError(error));
            if (!guild || !botMember || !voiceChannel || !textChannel)
                return ctx.error(`Unable to check channel permissions. Please try again.`);
            const voicePermissions = discord_rose_1.PermissionsUtils.combine({
                member: botMember,
                guild,
                roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new collection_1.Collection()),
                overwrites: voiceChannel.permission_overwrites
            });
            const textPermissions = discord_rose_1.PermissionsUtils.combine({
                member: botMember,
                guild,
                roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new collection_1.Collection()),
                overwrites: textChannel.permission_overwrites
            });
            if (!discord_rose_1.PermissionsUtils.has(voicePermissions, `connect`))
                return ctx.error(`The bot must have the "Connect" permission in your voice channel to play music.`);
            if (!discord_rose_1.PermissionsUtils.has(voicePermissions, `speak`))
                return ctx.error(`The bot must have the "Speak" permission in your voice channel to play music.`);
            if (voiceChannel.type === 13 && !discord_rose_1.PermissionsUtils.has(voicePermissions, `requestToSpeak`) && !discord_rose_1.PermissionsUtils.has(voicePermissions, `mute`))
                return ctx.error(`The bot must have the "Request To Speak" or "Mute Members" permission in your voice channel to play music.`);
            if (!discord_rose_1.PermissionsUtils.has(textPermissions, `sendMessages`))
                return ctx.error(`The bot must have the "Send Messages" permission in this text channel to play music.`);
            if (!discord_rose_1.PermissionsUtils.has(textPermissions, `embed`))
                return ctx.error(`The bot must have the "Embed Links" permission in this text channel to play music.`);
            player = ctx.worker.lavalink.createPlayer({
                becomeSpeaker: true,
                connectionTimeout: 15e3,
                guildId: ctx.interaction.guild_id,
                moveBehavior: `destroy`,
                selfDeafen: true,
                selfMute: false,
                stageMoveBehavior: `pause`,
                voiceChannelId: voiceChannel.id,
                textChannelId: textChannel.id
            });
            player.twentyfourseven = false;
        }
        if (player.state === lavalink_1.PlayerState.DISCONNECTED)
            await player.connect().catch((error) => discord_utils_1.Utils.logError(error));
        if (player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to connect to the voice channel.`);
        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.embed
                .color(Constants_1.default.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found a playlist, adding it to the queue...`)
                .send(true, false, true)
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
        else {
            await ctx.embed
                .color(Constants_1.default.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found ${search.tracks.length} result${search.tracks.length > 1 ? `s, queuing the first one` : `, adding it to the queue`}...`)
                .send(true, false, true)
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
        await player.play(search.loadType === `PLAYLIST_LOADED` ? search.tracks : search.tracks[0])
            .then(() => {
            if (search.loadType === `PLAYLIST_LOADED`) {
                ctx.worker.api.messages.send(ctx.interaction.channel_id, new discord_rose_1.Embed()
                    .color(Constants_1.default.ADDED_TO_QUEUE_EMBED_COLOR)
                    .title(`Successfully queued ${search.tracks.length} song${search.tracks.length > 1 ? `s` : ``}`)
                    .description(`**Link:** ${ctx.options.query}\n\`\`\`\n${search.tracks.slice(0, 8).map((track, i) => `${i + 1}. ${track.title}`).join(`\n`)}${search.tracks.length > 8 ? `\n\n${search.tracks.length - 8} more...` : ``}\n\`\`\``)
                    .footer(`Requested by ${search.tracks[0].requester}`)
                    .timestamp()).catch((error) => {
                    discord_utils_1.Utils.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            }
            else {
                ctx.worker.api.messages.send(ctx.interaction.channel_id, new discord_rose_1.Embed()
                    .color(Constants_1.default.ADDED_TO_QUEUE_EMBED_COLOR)
                    .title(`Added "${discord_utils_1.Utils.cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                    .footer(`Requested by ${search.tracks[0].requester}`)
                    .timestamp()).catch((error) => {
                    discord_utils_1.Utils.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            }
        })
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`An unknown error occurred while starting or queuing music. Please try again.`);
        });
    }
};
