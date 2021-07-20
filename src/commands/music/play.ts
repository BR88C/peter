import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions, Embed } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

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
            .title(`:mag_right:  Searching...`)
            .send(true, false, true)
            .catch((error) => void ctx.error(error));

        const requesterTag = `${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}`;
        const search = await ctx.worker.lavalink.search(ctx.options.query, ctx.interaction.member.nick ? `${ctx.interaction.member.nick} (${requesterTag})` : requesterTag);
        if (!search.tracks[0] || search.loadType === `LOAD_FAILED` || search.loadType === `NO_MATCHES`) return void ctx.error(`Unable to find any results based on the provided query.`);

        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) ?? ctx.worker.lavalink.createPlayer({
            guildId: ctx.interaction.guild_id,
            voiceChannelId: foundVoiceState.channel_id,
            textChannelId: ctx.interaction.channel_id
        });
        player.twentyfourseven = false;
        if (player.state === PlayerState.DISCONNECTED) await player.connect();

        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.embed
                .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found a playlist, adding it to the queue...`)
                .send(true, false, true)
                .catch((error) => void ctx.error(error));

            await ctx.worker.api.messages.send(ctx.interaction.channel_id, new Embed()
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Successfully queued ${search.tracks.length} song${search.tracks.length > 1 ? `s` : ``}`)
                .description(`**Link:** ${ctx.options.query}`)
                .footer(`Requested by ${search.tracks[0].requester}`)
                .timestamp()
            );
        } else {
            await ctx.embed
                .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found ${search.tracks.length} result${search.tracks.length > 1 ? `s, queuing the first one` : `, adding it to the queue`}...`)
                .send(true, false, true)
                .catch((error) => void ctx.error(error));

            await ctx.worker.api.messages.send(ctx.interaction.channel_id, new Embed()
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                .footer(`Requested by ${search.tracks[0].requester}`)
                .timestamp()
            );
        }

        await player.play(search.loadType === `PLAYLIST_LOADED` ? search.tracks : search.tracks[0]);
    }
} as CommandOptions;
