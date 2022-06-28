import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`resume`)
    .setDescription(`Resumes the current track`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        if (!player.paused) return ctx.error(`The track must be paused to use this command`);

        await player.resume();

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:arrow_forward:  Resumed`)
        );
    });
