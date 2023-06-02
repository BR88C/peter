"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`rotation`)
    .setDescription(`Adds a rotation (audio panning) filter to the audio`)
    .setGuildOnly(true)
    .addNumberOption(true, `value`, `The frequency to rotate at (small values like 0.1 create an "8D audio" effect); the default is 0`, {
    min_value: 0,
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
        rotation: { rotationHz: ctx.options.value }
    };
    if (newFilters.rotation.rotationHz === 0)
        delete newFilters.rotation;
    await player.setFilters(newFilters);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_PURPLE)
        .setTitle(ctx.options.value !== 0 ? `Set the rotation frequency to \`${ctx.options.value} Hz\`` : `Turned off the rotation filter`));
});
