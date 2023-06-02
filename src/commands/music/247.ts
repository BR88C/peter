import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`247`)
    .setDescription(`Toggles 24/7`)
    .setGuildOnly(true)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        if (process.env.VOTE_LINK?.length && !(await ctx.client.topggRequest(`GET`, `/bots/check`, { query: { userId: ctx.user.id } }).then((res) => !!res.voted))) {
            await ctx.sendEphemeral(
                new Embed()
                    .setColor(DiscordColors.BRANDING_RED)
                    .setTitle(`You must vote to use this command! Please vote by going to the link below.`)
                    .setDescription(process.env.VOTE_LINK)
            );
            return;
        }

        player.twentyfourseven = !player.twentyfourseven;
        if (player.loop === `off` && player.twentyfourseven) player.setLoop(`queue`);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_GRAY)
                .setTitle(`:clock4:  24/7 is now \`${player.twentyfourseven ? `On` : `Off`}\``)
        );
    });
