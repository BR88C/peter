import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`remove`)
    .setDescription(`Removes a track from the queue`)
    .setDmPermission(false)
    .addIntegerParameter(true, `index`, `The track's index in the queue`)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        if (ctx.parameters.index < 1 || ctx.parameters.index > player.queue.length) return void ctx.error(`Invalid queue index; must be a value of 1-${player.queue.length}`);

        const removedTrack = await player.remove(ctx.parameters.index - 1);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_ORANGE)
                .setTitle(`:wastebasket:  Removed "${cleanseMarkdown(removedTrack?.title ?? `Unknown track`)}" from the queue`)
        );
    });
