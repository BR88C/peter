import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`volume`)
    .setDescription(`Sets the volume of the audio`)
    .setDmPermission(false)
    .addIntegerParameter(true, `value`, `The volume to use, as a percent; the default is 100`, {
        min: 0,
        max: 1000
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        await player.setVolume(ctx.parameters.value);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.parameters.value !== 0 ? `Set the volume to \`${ctx.parameters.value}%\`` : `Muted the audio`)
        );
    });
