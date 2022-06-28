import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`replay`)
    .setDescription(`Seeks to the beginning of the current track`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        if (!player.currentTrack) return ctx.error(`There are currently no tracks playing`);

        if (!player.currentTrack.isSeekable) return ctx.error(`The current track is not seekable`);

        await player.seek(0);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:rewind:  Seeked to the beginning of the track`)
        );
    });
