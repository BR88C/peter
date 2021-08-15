import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `remove`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `remove`,
        description: `Remove a song from the queue.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The song's index in the queue.`,
                required: true
            }
        ]
    },
    exec: (ctx) => {
        if (ctx.options.index < 1 || ctx.options.index > ctx.player!.queue.length) return void ctx.error(`Please specify a valid index of the queue.`);
        ctx.player!.remove(ctx.options.index - 1)
            .then((removedTrack) => {
                ctx.embed
                    .color(Constants.REMOVED_TRACK_EMBED_COLOR)
                    .title(`:x:  Removed "${removedTrack.title}" from the queue`)
                    .send()
                    .catch((error) => {
                        logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                logError(error);
                void ctx.error(`An unknown error occurred while removing music from the queue. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
