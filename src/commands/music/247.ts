import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`247`)
    .setDescription(`Toggles 24/7`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        if (ctx.client.topgg && process.env.VOTE_LINK && !(await ctx.client.topgg.hasVoted(ctx.user.id).catch(() => true))) {
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
