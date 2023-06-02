"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`pitch`)
    .setDescription(`Changes the pitch of the audio`)
    .setGuildOnly(true)
    .addIntegerOption(true, `value`, `The pitch to set the audio to, as a percent; the default is 100`, {
    min_value: 1,
    max_value: Constants_1.Constants.DEFAULT_MAX_SFX
})
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        throw new Error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        throw new Error(`You must be in the same voice channel as the bot to use this command`);
    const newFilters = {
        ...player.filters,
        timescale: {
            ...player.filters.timescale,
            pitch: ctx.options.value / 100
        }
    };
    if (newFilters.timescale.pitch === 1)
        delete newFilters.timescale.pitch;
    if (!Object.keys(newFilters.timescale).length)
        delete newFilters.timescale;
    await player.setFilters(newFilters);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_PURPLE)
        .setTitle(ctx.options.value !== 100 ? `Set the pitch to \`${ctx.options.value}%\`` : `Turned off the pitch filter`));
});
