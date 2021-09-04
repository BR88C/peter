import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';
import { Utils } from '@br88c/discord-utils';

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
    exec: (ctx) => {
        if (!(ctx.player!.queue[ctx.player!.queuePosition ?? 0] as Track).isSeekable || (ctx.player!.queue[ctx.player!.queuePosition ?? 0] as Track).isStream) return void ctx.error(`The current song does not support seeking.`);
        if (ctx.options.time < 0) return void ctx.error(`Invalid value to seek to.`);
        ctx.player!.seek(ctx.options.time * 1e3)
            .then(() => {
                ctx.embed
                    .color(Constants.SEEK_EMBED_COLOR)
                    .title(`:fast_forward:  Seeked to ${Utils.timestamp(ctx.options.time * 1e3)}`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while seeking. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
