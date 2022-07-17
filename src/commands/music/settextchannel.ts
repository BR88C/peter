import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';
import { DiscordConstants, PermissionsUtils } from 'distype';
import { Constants } from '../../utils/Constants';

export default new ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends messages in`)
    .setDmPermission(false)
    .addChannelParameter(false, `channel`, `The new channel to use`, [ChannelType.GuildText, ChannelType.GuildVoice])
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        const newChannel = ctx.client.cache.channels?.get(ctx.parameters.channel?.id ?? ctx.channelId);
        if (!newChannel) return ctx.error(`Unable to get information about that channel`);

        const permissions = await ctx.client.getSelfPermissions(ctx.guildId, newChannel.id);
        if (!PermissionsUtils.hasPerms(permissions, ...Constants.TEXT_PERMISSIONS, newChannel.type === ChannelType.GuildPublicThread || newChannel.type === ChannelType.GuildPrivateThread ? DiscordConstants.PERMISSION_FLAGS.SEND_MESSAGES_IN_THREADS : 0)) {
           return ctx.error(`Missing one of the following permissions in the voice channel: ${LavalinkConstants.REQUIRED_PERMISSIONS.VOICE.join(`, `)}`, DistypeLavalinkErrorType.PLAYER_MISSING_PERMISSIONS, this.system);
        }

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:scroll: ${newChannel.name ? `Now sending messages to \`${newChannel.name}\`` : `Changed the channel to send messages to`}`)
        );
    });
