import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/run/runWorker';

// Import modules.
import { CommandOptions, Embed } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `play`,
    interaction: {
        name: `play`,
        description: `Plays a specified song or video.`,
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
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (!foundVoiceState) return void ctx.error(`You must be in a voice channel to play a track.`);

        const existingPlayer = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (existingPlayer && foundVoiceState.channel_id !== existingPlayer.options.voiceChannelId) return void ctx.error(`You must be in the VC to play a track.`);

        await ctx.embed
            .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
            .title(`:mag_right:  Searching...`)
            .send(true, false, true)
            .catch((error) => void ctx.error(error));

        const requesterTag = `${ctx.author.username}#${ctx.author.discriminator}`;
        const search = await ctx.worker.lavalink.search(ctx.options.query, ctx.member.nick ? `${ctx.member.nick} (${requesterTag})` : requesterTag);
        if (!search.tracks[0] || search.loadType === `LOAD_FAILED` || search.loadType === `NO_MATCHES`) return void ctx.error(`Unable to find any results based on the provided query.`);

        let player: ExtendedPlayer;
        if (existingPlayer) player = existingPlayer
        else {
            player = ctx.worker.lavalink.createPlayer({
                becomeSpeaker: true,
                connectionTimeout: 15e3,
                guildId: ctx.interaction.guild_id!,
                moveBehavior: `destroy`,
                selfDeafen: true,
                selfMute: false,
                stageMoveBehavior: `pause`,
                voiceChannelId: foundVoiceState.channel_id,
                textChannelId: ctx.interaction.channel_id
            });
            player.twentyfourseven = false;
        }

        if (player.state === PlayerState.DISCONNECTED) await player.connect();
        if (player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to connect to the VC.`)

        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.embed
                .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found a playlist, adding it to the queue...`)
                .send(true, false, true)
                .catch((error) => void ctx.error(error));

            await ctx.worker.api.messages.send(ctx.interaction.channel_id, new Embed()
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Successfully queued ${search.tracks.length} track${search.tracks.length > 1 ? `s` : ``}`)
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
