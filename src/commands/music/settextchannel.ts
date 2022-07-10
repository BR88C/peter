import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { ChannelType } from 'discord-api-types/v10';

export default new ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends messages in`)
    .setDmPermission(false)
    .addChannelParameter(false, `channel`, `The new channel to use`, [ChannelType.GuildText, ChannelType.GuildVoice])
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        player.textChannel = ctx.parameters.channel?.id ?? null;

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:scroll:  ${ctx.parameters.channel ? `Now sending messages to \`${ctx.parameters.channel.name}\`` : `Turned off sending messages`}`)
        );
    });
