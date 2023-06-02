import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`loop`)
    .setDescription(`Modifies the looping behavior of the queue`)
    .setGuildOnly(true)
    .addStringOption(true, `type`, `The type of loop behavior to use`, { choices: [
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
    ] })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        player.setLoop(ctx.options.type as any);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_BLUE)
                .setTitle(`:repeat:  Looping is now set to \`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``)
        );
    });
