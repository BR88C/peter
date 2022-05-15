import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`loop`)
    .setDescription(`Modifies the looping behavior of the queue`)
    .addStringParameter(true, `type`, `The type of loop behavior to use`, [
        {
            name: `Queue - Once the end of the queue is reached, it will loop back to the first track`,
            value: `queue`
        },
        {
            name: `Single - Loops the current track`,
            value: `single`
        },
        {
            name: `Off - Disables looping`,
            value: `off`
        }
    ])
    .setExecute(async (ctx) => {
        if (!ctx.guildId) return ctx.error(`This command only works in servers`);

        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        player.setLoop(ctx.parameters.type as any);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:repeat:  Looping is now set to \`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``)
        );
    });
