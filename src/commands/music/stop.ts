import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`stop`)
    .setDescription(`Stops playing`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        await player.stop();

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BRANDING_RED)
                .setTitle(`:octagonal_sign:  Stopped`)
        );
    });
