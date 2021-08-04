import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';
import { logError } from '../../utils/Log';

import { ExtendedPlayer } from '../../typings';

// Import modules.
import { CommandOptions, Embed } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `play`,
    userMustBeInVC: true,
    interaction: {
        name: `play`,
        description: `Plays a specified song or video, or adds it to the queue.`,
        options: [
            {
                type: 3,
                name: `query`,
                description: `A YouTube link, a Spotify link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.player && ctx.voiceState!.channel_id !== ctx.player.options.voiceChannelId) return void ctx.error(`You must be in the same voice channel as the bot to run the "${ctx.command.interaction!.name}" command.`);

        await ctx.embed
            .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
            .title(`:mag_right:  Searching...`)
            .send(true, false, true)
            .catch(() => void ctx.error(`Unable to send the response message.`));

        const requesterTag = `${ctx.author.username}#${ctx.author.discriminator}`;

        const search = await ctx.worker.lavalink.search(ctx.options.query, ctx.member.nick ? `${ctx.member.nick} (${requesterTag})` : requesterTag).catch((error) => {
            logError(error);
            void ctx.error(`An unknown search error occurred. Please submit an issue in our support server.`);
        });
        if (!search) return;
        if (search.exception) {
            ctx.worker.log(`\x1b[31mSearch Error | Error: ${search.exception.message} | Severity: ${search.exception.severity} | Guild ID: ${ctx.interaction.guild_id}`);
            return void ctx.error(`An unknown search error occurred. Please submit an issue in our support server.`);
        }
        if (!search.tracks[0] || search.loadType === `LOAD_FAILED` || search.loadType === `NO_MATCHES`) return void ctx.error(`Unable to find any results based on the provided query.`);

        let player: ExtendedPlayer;
        if (ctx.player) player = ctx.player;
        else {
            player = ctx.worker.lavalink.createPlayer({
                becomeSpeaker: true,
                connectionTimeout: 15e3,
                guildId: ctx.interaction.guild_id!,
                moveBehavior: `destroy`,
                selfDeafen: true,
                selfMute: false,
                stageMoveBehavior: `pause`,
                voiceChannelId: ctx.voiceState!.channel_id,
                textChannelId: ctx.interaction.channel_id
            });
            player.twentyfourseven = false;
        }

        if (player.state === PlayerState.DISCONNECTED) await player.connect();
        if (player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to connect to the voice channel.`);

        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.embed
                .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found a playlist, adding it to the queue...`)
                .send(true, false, true)
                .catch(() => void ctx.error(`Unable to send the response message.`));

            await ctx.worker.api.messages.send(ctx.interaction.channel_id, new Embed()
                .color(Constants.ADDED_TO_QUEUE_EMBED_COLOR)
                .title(`Successfully queued ${search.tracks.length} song${search.tracks.length > 1 ? `s` : ``}`)
                .description(`**Link:** ${ctx.options.query}\n\`\`\`\n${search.tracks.slice(0, 8).map((track, i) => `${i + 1}. ${track.title}`).join(`\n`)}${search.tracks.length > 8 ? `\n\n${search.tracks.length - 8} more...` : ``}\n\`\`\``)
                .footer(`Requested by ${search.tracks[0].requester}`)
                .timestamp()
            );
        } else {
            await ctx.embed
                .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
                .title(`:mag_right:  Found ${search.tracks.length} result${search.tracks.length > 1 ? `s, queuing the first one` : `, adding it to the queue`}...`)
                .send(true, false, true)
                .catch(() => void ctx.error(`Unable to send the response message.`));

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
