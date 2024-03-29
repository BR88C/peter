import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`previous`)
    .setDescription(`Skips to the previous track`)
    .setGuildOnly(true)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        const newPosition = (player.queuePosition ?? player.queue.length) - 1;
        if (!player.queue[newPosition]) throw new Error(`There are no previous tracks to skip to`);

        await player.skip(newPosition);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:track_previous:  Skipped to the previous track`)
        );
    });
