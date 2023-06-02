"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
const v10_1 = require("discord-api-types/v10");
const distype_1 = require("distype");
exports.default = new cmd_1.ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends messages in`)
    .setGuildOnly(true)
    .addChannelOption(false, `channel`, `The new channel to use`, { channel_types: [v10_1.ChannelType.GuildText, v10_1.ChannelType.GuildVoice] })
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        throw new Error(`The bot must be connected to a voice channel to use this command`);
    const newChannel = ctx.client.cache.channels?.get(ctx.options.channel?.id ?? ctx.channelId);
    if (!newChannel)
        throw new Error(`Unable to get information about that channel`);
    const textMissingPerms = distype_1.PermissionsUtils.missingPerms(await ctx.client.getSelfPermissions(ctx.guildId, newChannel.id), ...Constants_1.Constants.TEXT_PERMISSIONS);
    if (textMissingPerms !== 0n) {
        throw new Error(`Missing the following permissions in the text channel: ${distype_1.PermissionsUtils.toReadable(textMissingPerms).join(`, `)}`);
    }
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:scroll: ${newChannel.name ? `Now sending messages to \`${newChannel.name}\`` : `Changed the channel to send messages to`}`));
});
