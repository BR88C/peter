"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`tremolo`)
    .setDescription(`Adds a tremolo filter to the audio`)
    .setGuildOnly(true)
    .addIntegerOption(true, `value`, `The tremolo depth (the amount of volume to fluctuate), as a percent; the default is 0`, {
    min_value: 0,
    max_value: 100
})
    .addNumberOption(false, `frequency`, `The frequency to fluctuate the volume at; the default is ${Constants_1.Constants.TREMOLO_VIBRATO_FREQUENCY}`, {
    min_value: 0.001,
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
        tremolo: {
            depth: ctx.options.value / 100,
            frequency: (ctx.options.frequency ?? player.filters.tremolo?.frequency) ?? Constants_1.Constants.TREMOLO_VIBRATO_FREQUENCY
        }
    };
    if (newFilters.tremolo.depth === 0)
        delete newFilters.tremolo;
    await player.setFilters(newFilters);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_PURPLE)
        .setTitle(ctx.options.value !== 0 ? `Set tremolo to \`${ctx.options.value}%\`${typeof ctx.options.frequency === `number` ? ` with a frequency of \`${ctx.options.frequency} Hz\`` : ``}` : `Turned off the tremolo filter`));
});
