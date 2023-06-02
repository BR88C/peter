"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`skip`)
    .setDescription(`Skips to a specified track or to the next track in the queue`)
    .setGuildOnly(true)
    .addIntegerOption(false, `index`, `The index of the queue to skip to`)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        throw new Error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        throw new Error(`You must be in the same voice channel as the bot to use this command`);
    await player.skip(typeof ctx.options.index === `number` ? ctx.options.index - 1 : undefined);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:track_next:  Skipped to ${typeof ctx.options.index === `number` ? `"${(0, cmd_1.cleanseMarkdown)(player.currentTrack?.title ?? `Unknown track`)}"` : `the next track`}`));
});
