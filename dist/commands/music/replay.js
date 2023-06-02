"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`replay`)
    .setDescription(`Seeks to the beginning of the current track`)
    .setGuildOnly(true)
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
    await player.seek(0);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:rewind:  Seeked to the beginning of the track`));
});
