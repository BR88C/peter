import { Constants } from '../../config/Constants';
import { timestamp } from '../../utils/Time';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `seek`,
    interaction: {
        name: `seek`,
        description: `Seek to a position in the current track.`,
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
        if (!player || !player.queue.length) return void ctx.error(`Unable to seek; there are no tracks in the queue.`);
        if (player.state !== PlayerState.PAUSED && player.state !== PlayerState.PLAYING) return void ctx.error(`Unable to seek; there are no tracks playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to seek.`);

        if (ctx.options.time < 0 || ctx.options.time > Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value to seek to.`);

        await player.seek(ctx.options.time);

        ctx.embed
            .color(Constants.SEEK_EMBED_COLOR)
            .title(`:fast_forward:  Seeked to ${timestamp(ctx.options.time * 1e3)}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
