"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
const v10_1 = require("discord-api-types/v10");
exports.default = new cmd_1.ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends "now playing" messages in`)
    .setDmPermission(false)
    .addChannelParameter(true, `channel`, `The new channel to use`, [v10_1.ChannelType.GuildText, v10_1.ChannelType.GuildVoice])
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to use this command`);
    player.textChannel = ctx.parameters.channel.id;
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_BLUE)
        .setTitle(`:scroll:  Now sending messages to \`${ctx.parameters.channel.name}\``));
});
