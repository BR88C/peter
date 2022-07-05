import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`play`)
    .setDescription(`Plays a specified song or video, or adds it to the queue`)
    .setDmPermission(false)
    .addStringParameter(true, `query`, `A YouTube / Soundcloud / Spotify / mp3 link, or the name of a song / video`)
    .setExecute(async (ctx) => {
        const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
        if (!voiceState?.channel_id) {
            if (!ctx.client.cache.guilds?.has(ctx.guildId)) return ctx.error(`Cannot determine if you are connected to a voice channel; the bot is most likely in the process of starting`);
            else return ctx.error(`You must be connected to a voice channel to play a track`);
        }

        await ctx.defer();

        const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
        player.textChannel ??= ctx.channelId;
        player.twentyfourseven = false;
        player.voiceTimeout ??= null;

        if (player.voiceChannel !== voiceState.channel_id) return ctx.error(`You must be in the same channel as the bot to play a track`);

        const searchingMessage = await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_YELLOW)
                .setTitle(`:mag_right:  Searching for "${cleanseMarkdown(ctx.parameters.query)}"...`)
        );

        const search = await ctx.client.lavalink.search(ctx.parameters.query, `${ctx.user.username}#${ctx.user.discriminator}`);
        if (search.exception) return ctx.error(search.exception.message);

        if (!search.tracks.length) return ctx.error(`No tracks found for query "${cleanseMarkdown(ctx.parameters.query)}"`);

        await player.play(search.loadType === `PLAYLIST_LOADED` ? search.tracks : search.tracks[0]);

        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.edit(searchingMessage,
                new Embed()
                    .setColor(DiscordColors.ROLE_GREEN)
                    .setTitle(`Successfully queued ${search.tracks.length} track${search.tracks.length > 1 ? `s` : ``}`)
                    .setDescription(`**Link:** ${cleanseMarkdown(ctx.parameters.query)}\n\`\`\`\n${search.tracks.slice(0, 8).map((track, i) => `${i + 1}. ${cleanseMarkdown(track.title)}`).join(`\n`)}${search.tracks.length > 8 ? `\n\n${search.tracks.length - 8} more...` : ``}\n\`\`\``)
                    .setFooter(`Requested by ${search.tracks[0].requester}`)
            );
        } else {
            await ctx.edit(searchingMessage,
                new Embed()
                    .setColor(DiscordColors.ROLE_GREEN)
                    .setTitle(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                    .setURL(search.tracks[0].uri)
                    .setFooter(`Requested by ${search.tracks[0].requester}`)
            );
        }
    });
