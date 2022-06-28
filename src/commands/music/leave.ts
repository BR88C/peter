import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`leave`)
    .setDescription(`Disconnects the bot from the voice channel and destroys the queue`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        player.destroy(`/leave`);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BRANDING_RED)
                .setTitle(`:wave:  Left the voice channel`)
        );
    });
