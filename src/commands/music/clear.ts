import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`clear`)
    .setDescription(`Clears the queue`)
    .setExecute(async (ctx) => {
        if (!ctx.guildId) return ctx.error(`This command only works in servers`);

        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        await player.clear(true);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_ORANGE)
                .setTitle(`:broom:  Cleared the queue`)
        );
    });
