"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`clearfilters`)
    .setDescription(`Clears filters (bassboost, speed, pitch, etc.)`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        return ctx.error(`You must be in the same voice channel as the bot to use this command`);
    await player.setFilters({});
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_ORANGE)
        .setTitle(`:broom:  Cleared filters`));
});
