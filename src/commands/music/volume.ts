import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`volume`)
    .setDescription(`Sets the volume of the audio`)
    .setGuildOnly(true)
    .addIntegerOption(true, `value`, `The volume to use, as a percent; the default is 100`, {
        min_value: 0,
        max_value: 1000
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        await player.setVolume(ctx.options.value);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.options.value !== 0 ? `Set the volume to \`${ctx.options.value}%\`` : `Muted the audio`)
        );
    });
