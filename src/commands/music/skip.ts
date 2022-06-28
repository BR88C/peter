import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`skip`)
    .setDescription(`Skips to a specified track or to the next track in the queue`)
    .setDmPermission(false)
    .addIntegerParameter(false, `index`, `The index of the queue to skip to`)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        await player.skip(typeof ctx.parameters.index === `number` ? ctx.parameters.index - 1 : undefined);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:track_next:  Skipped to ${typeof ctx.parameters.index === `number` ? `"${cleanseMarkdown(player.currentTrack?.title ?? `Unknown track`)}"` : `the next track`}`)
        );
    });
