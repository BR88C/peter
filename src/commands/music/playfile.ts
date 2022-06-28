import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`playfile`)
    .setDescription(`Plays a file`)
    .setDmPermission(false)
    .addAttachmentParameter(true, `file`, `The file to play`)
    .setExecute(async (ctx) => {
        const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
        if (!voiceState?.channel_id) {
            if (!ctx.client.cache.guilds?.has(ctx.guildId)) return ctx.error(`Cannot determine if you are connected to a voice channel; the bot is most likely in the process of starting`);
            else return ctx.error(`You must be connected to a voice channel to play a track`);
        }

        await ctx.defer();

        const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
        player.voiceTimeout ??= null;
        player.textChannel ??= ctx.channelId;

        if (player.voiceChannel !== voiceState.channel_id) return ctx.error(`You must be in the same channel as the bot to play a track`);

        const search = await ctx.client.lavalink.search(ctx.parameters.file.url, `${ctx.user.username}#${ctx.user.discriminator}`);
        if (search.exception) return ctx.error(search.exception.message);

        if (!search.tracks[0]) {
            const parts = ctx.parameters.file.filename.split(`.`);
            return ctx.error(`File type "${cleanseMarkdown(parts[parts.length - 1] ?? `Unknown`)}" not supported`);
        }

        await player.play(search.tracks[0]);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_GREEN)
                .setTitle(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                .setURL(search.tracks[0].uri)
                .setFooter(`Requested by ${search.tracks[0].requester}`)
        );
    });
