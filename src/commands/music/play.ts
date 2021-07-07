import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Player, SearchResult } from 'erela.js';

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

        const search: SearchResult = await ctx.worker.lavalink.search(ctx.options.query, `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`);
        if (!search.tracks.length) return void ctx.error(`Unable to find any results based on the provided query.`);
        console.log(search.tracks.length);

        const player: Player = ctx.worker.lavalink.create({
            guild: ctx.interaction.guild_id,
            voiceChannel: foundVoiceState.channel_id,
            textChannel: ctx.interaction.channel_id
        });
        player.connect();

        if (!search.playlist) {
            player.queue.add(search.tracks[0]);
            await ctx.embed
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                .footer(`Requested by ${search.tracks[0].requester}`)
                .timestamp()
                .send()
                .catch((error) => void ctx.error(error));
        } else {
            for (const track of search.tracks) player.queue.add(track);
            await ctx.embed
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Successfully queued ${search.tracks.length} song${search.tracks.length > 1 ? `s` : ``}`)
                .footer(`Requested by ${search.tracks[0].requester}`)
                .timestamp()
                .send()
                .catch((error) => void ctx.error(error));
        }

        if (!player.playing && !player.paused) player.play().catch((error) => void ctx.error(error));
    }
} as CommandOptions;
