"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const collection_1 = require("@discordjs/collection");
const discord_rose_1 = require("discord-rose");
const lavalink_1 = require("@discord-rose/lavalink");
const Middleware = async (ctx) => {
    if (!ctx.worker.available) {
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
                ctx.worker.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild ID: ${ctx.message.guild_id}` : ``}`);
                return true;
            }
        }
    }
    else {
        ctx.player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        ctx.voiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
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
        if (ctx.command.userMustBeInSameVC && (!ctx.player || ctx.voiceState?.channel_id !== ctx.player.options.voiceChannelId)) {
            void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction.name}" command.`);
            return false;
        }
        if (ctx.command.userMustBeInVC && !ctx.voiceState) {
            void ctx.error(`You must be in a voice channel to run the "${ctx.command.interaction.name}" command.`);
            return false;
        }
        if (ctx.command.voteLocked && !(await ctx.worker.comms.sendCommand(`CHECK_VOTE`, ctx.author.id))) {
            await ctx.embed
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`You must vote to use this command! Please vote by going to the link below.`)
                .description(Constants_1.Constants.VOTE_LINK)
                .send(true, false, true)
                .catch(() => void ctx.error(`Unable to send the response message.`));
            return false;
        }
        if (ctx.command.category === `music`) {
            const guildDocument = await ctx.worker.mongoClient.db(Config_1.Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
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
        ctx.worker.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild ID: ${ctx.interaction.guild_id}`);
        return true;
    }
};
exports.Middleware = Middleware;
