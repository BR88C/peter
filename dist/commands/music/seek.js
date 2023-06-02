"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_utils_1 = require("@br88c/node-utils");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`seek`)
    .setDescription(`Seeks to a specified position in the track`)
    .setGuildOnly(true)
    .addIntegerOption(true, `time`, `The time in seconds to seek to`)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        throw new Error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        throw new Error(`You must be in the same voice channel as the bot to use this command`);
    if (!player.currentTrack)
        throw new Error(`There are currently no tracks playing`);
    if (!player.currentTrack.isSeekable)
        throw new Error(`The current track is not seekable`);
    await player.seek(ctx.options.time * 1000);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:fast_forward:  Seeked to \`${(0, node_utils_1.timestamp)(ctx.options.time * 1000)}\``));
});
