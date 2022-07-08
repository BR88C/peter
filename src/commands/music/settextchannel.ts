import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { ChannelType } from 'discord-api-types/v10';

export default new ChatCommand()
    .setName(`settextchannel`)
    .setDescription(`Sets the text channel the bot sends "now playing" messages in`)
    .setDmPermission(false)
    .addChannelParameter(true, `channel`, `The new channel to use`, [ChannelType.GuildText, ChannelType.GuildVoice])
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        player.textChannel = ctx.parameters.channel.id;

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:scroll:  Now sending messages to \`${ctx.parameters.channel.name}\``)
        );
    });
