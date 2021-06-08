import { Constants } from '../../config/Constants';
import { Queue } from '../../structures/Queue';
import { Search } from '../../structures/Search';
import { Song } from '../../structures/Song';

// Import modules.
import { CommandError, CommandOptions, Embed } from 'discord-rose';

export default {
    command: `play`,
    interaction: {
        name: `play`,
        description: `Plays a specified song.`,
        options: [
            {
                type: 3,
                name: `query`,
                description: `A YouTube link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (!ctx.interaction.channel_id || !ctx.interaction.guild_id) return void ctx.error(`An unknown error occured when trying to connect to the voice channel.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState) return void ctx.error(`You must be in a voice channel to play music.`);

        await ctx.embed
            .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
            .title(`Processing query...`)
            .send()
            .catch((error) => void ctx.error(error));

        const queue = ctx.worker.queue.get(ctx.interaction.guild_id) ?? new Queue(ctx.interaction.channel_id, foundVoiceState.channel_id, ctx.interaction.guild_id, ctx.worker);

        try {
            const search = new Search(ctx.options.query);
            let newSong: Song | undefined;
            if (search.queryType === `playlistURL`) {
                const urls: string[] | undefined = await search.getPlaylistURLs();
                if (!urls) return;
                await queue.addPlaylist(urls, `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`, (song) => {
                    if (song instanceof CommandError) ctx.send(song.message).catch((error) => void ctx.error(error));
                    return true;
                });
            } else {
                const url: string | undefined = await search.getURL();
                if (!url) return;
                newSong = await queue.addSong(url, `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`);
            }

            await ctx.embed
                .color(Constants.CONNECTING_EMBED_COLOR)
                .title(`Connecting...`)
                .send()
                .catch((error) => void ctx.error(error));

            if (!queue.player.connection) await queue.player.createConnection();

            if (!queue.songs[queue.playing]) {
                queue.playing = queue.songs.length - 1;
                await queue.player.playSong();
                await queue.sendEmbed(new Embed()
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Started playing: ${queue.songs[queue.playing].title}`)
                    .description(`**Link:** ${queue.songs[queue.playing].url}`)
                    .image(queue.songs[queue.playing].thumbnail ?? ``)
                    .footer(`Requested by: ${queue.songs[queue.playing].requestedBy}`)
                    .timestamp()
                );
            } else if (newSong) {
                ctx.embed
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Added "${newSong.title}" to the queue`)
                    .description(`**Link:** ${newSong.url}`)
                    .image(newSong.thumbnail ?? ``)
                    .footer(`Requested by: ${newSong.requestedBy}`)
                    .timestamp()
                    .send()
                    .catch((error) => void ctx.error(error));
            }
        } catch (error) {
            void queue.sendErrorEmbed(error);
        }
    }
} as CommandOptions;
