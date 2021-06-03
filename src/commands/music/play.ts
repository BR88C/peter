import { Constants } from '../../config/Constants';
import { Queue } from '../../structures/Queue';
import { Search } from '../../structures/Search';

// Import modules.
import { CommandError, CommandOptions } from 'discord-rose';

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

        const queue = new Queue(ctx.interaction.channel_id, foundVoiceState.channel_id, ctx.interaction.guild_id, ctx.worker);

        const search = new Search(ctx.options.query);
        if (search.queryType === `playlistURL`) {
            const urls = await search.getPlaylistURLs();
            await queue.addPlaylist(urls, `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`, (song) => {
                if (song instanceof CommandError) ctx.send(song.message).catch((error) => void ctx.error(error)); ;
                return true;
            });
        } else {
            const url = await search.getURL();
            await queue.addSong(url, `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`).catch((error) => void ctx.error(error)); ;
        }

        await ctx.embed
            .color(Constants.CONNECTING_EMBED_COLOR)
            .title(`Connecting...`)
            .send()
            .catch((error) => void ctx.error(error));

        queue.createConnection().then(() => {
            queue.playSong().then(() => {
                ctx.embed
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Started playing: ${queue.songs[queue.playing].title}`)
                    .description(`**Link:** ${queue.songs[queue.playing].url}`)
                    .image(queue.songs[queue.playing].thumbnail ?? ``)
                    .footer(`Requested by: ${queue.songs[queue.playing].requestedBy}`)
                    .timestamp()
                    .send()
                    .catch((error) => void ctx.error(error));
            }).catch((error) => void ctx.error(error));
        }).catch((error) => void ctx.error(error));
    }
} as CommandOptions;
