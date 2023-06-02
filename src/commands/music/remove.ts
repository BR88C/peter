import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`remove`)
    .setDescription(`Removes a track from the queue`)
    .setGuildOnly(true)
    .addIntegerOption(true, `index`, `The track's index in the queue`)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        if (ctx.options.index < 1 || ctx.options.index > player.queue.length) throw new Error(`Invalid queue index; must be a value of 1-${player.queue.length}`);

        const removedTrack = await player.remove(ctx.options.index - 1);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_ORANGE)
                .setTitle(`:wastebasket:  Removed "${cleanseMarkdown(removedTrack?.title ?? `Unknown track`)}" from the queue`)
        );
    });
