"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`bassboost`)
    .setDescription(`Bassboosts the audio`)
    .addIntegerParameter(true, `value`, `The value to bassboost by; the default is 0`, {
    min: 0,
    max: Constants_1.Constants.DEFAULT_MAX_SFX
})
    .setExecute(async (ctx) => {
    if (!ctx.guildId)
        return ctx.error(`This command only works in servers`);
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to use this command`);
    if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id)
        return ctx.error(`You must be in the same voice channel as the bot to use this command`);
    const newFilters = {
        ...player.filters,
        equalizer: (player.filters.equalizer?.filter((v) => v.band > 2) ?? []).concat(ctx.parameters.value === 0 ? [] : new Array(3).fill(null).map((_, i) => ({
            band: i,
            gain: ctx.parameters.value * Constants_1.Constants.BASSBOOST_INTENSITY_MULTIPLIER
        })))
    };
    if (!newFilters.equalizer.length)
        delete newFilters.equalizer;
    await player.setFilters(newFilters);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_PURPLE)
        .setTitle(ctx.parameters.value !== 0 ? `Set bassboost to \`+${ctx.parameters.value}\`` : `Turned off the bassboost filter`));
});
