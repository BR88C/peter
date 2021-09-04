import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `skip`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `skip`,
        description: `Skip to the next song, or to a specified song.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The index of the queue to skip to.`,
                required: false
            }
        ]
    },
    exec: (ctx) => {
        const index = typeof ctx.options.index === `number` ? ctx.options.index - 1 : undefined;
        if (index && (index < 0 || index >= ctx.player!.queue.length)) return void ctx.error(`Invalid index. Please specify a value greater than 0 and less than or equal to the queue's length.`);
        ctx.player!.skip(index)
            .then(() => {
                ctx.embed
                    .color(Constants.SKIP_EMBED_COLOR)
                    .title(`:track_next:  Skipped to ${typeof index === `number` ? `song ${index + 1}` : `the next song`}`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while skipping. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
