import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { ChannelType } from 'discord-api-types/v10';
import { PermissionsUtils } from 'distype';

export default new ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends messages in`)
    .setGuildOnly(true)
    .addChannelOption(false, `channel`, `The new channel to use`, { channel_types: [ChannelType.GuildText, ChannelType.GuildVoice] })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        const newChannel = ctx.client.cache.channels?.get(ctx.options.channel?.id ?? ctx.channelId);
        if (!newChannel) throw new Error(`Unable to get information about that channel`);

        const textMissingPerms = PermissionsUtils.missingPerms(await ctx.client.getSelfPermissions(ctx.guildId, newChannel.id), ...Constants.TEXT_PERMISSIONS);
        if (textMissingPerms !== 0n) {
            throw new Error(`Missing the following permissions in the text channel: ${PermissionsUtils.toReadable(textMissingPerms).join(`, `)}`);
        }

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:scroll: ${newChannel.name ? `Now sending messages to \`${newChannel.name}\`` : `Changed the channel to send messages to`}`)
        );
    });
