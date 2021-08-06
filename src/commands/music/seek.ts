import { Constants } from '../../config/Constants';

// Import modules.
import { timestamp } from '@br88c/discord-utils';
import { CommandOptions } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';

export default {
    command: `seek`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
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
        if (!(ctx.player!.queue[ctx.player!.queuePosition ?? 0] as Track).isSeekable || (ctx.player!.queue[ctx.player!.queuePosition ?? 0] as Track).isStream) return void ctx.error(`The current song does not support seeking.`);
        if (ctx.options.time < 0) return void ctx.error(`Invalid value to seek to.`);
        await ctx.player!.seek(ctx.options.time * 1e3);

        ctx.embed
            .color(Constants.SEEK_EMBED_COLOR)
            .title(`:fast_forward:  Seeked to ${timestamp(ctx.options.time * 1e3)}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
