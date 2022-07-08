"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`previous`)
    .setDescription(`Skips to the previous track`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        return ctx.error(`You must be in the same voice channel as the bot to use this command`);
    const newPosition = (player.queuePosition ?? player.queue.length) - 1;
    if (!player.queue[newPosition])
        return void ctx.error(`There are no previous tracks to skip to`);
    await player.skip(newPosition);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:track_previous:  Skipped to the previous track`));
});
