import { Constants } from '../../config/Constants';
import { timestamp } from '../../utils/Time';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState, Track } from '@discord-rose/lavalink';

export default {
    command: `seek`,
    interaction: {
        name: `seek`,
        description: `Seek to a position in the song.`,
        options: [
            {
                type: 4,
                name: `time`,
                description: `The time in seconds to seek to.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to seek; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to seek; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < PlayerState.PAUSED) return void ctx.error(`Unable to seek; there is no music playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to seek.`);

        if (!(player.queue[player.queuePosition] as Track).isSeekable || (player.queue[player.queuePosition] as Track).isStream) return void ctx.error(`The current song does not support seeking.`);
        if (ctx.options.time < 0) return void ctx.error(`Invalid value to seek to.`);

        await player.seek(ctx.options.time * 1e3);

        ctx.embed
            .color(Constants.SEEK_EMBED_COLOR)
            .title(`:fast_forward:  Seeked to ${timestamp(ctx.options.time * 1e3)}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;