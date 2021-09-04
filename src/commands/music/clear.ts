import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `clear`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        ctx.player!.clear()
            .then(() => {
                ctx.embed
                    .color(Constants.QUEUE_CLEARED_EMBED_COLOR)
                    .title(`:broom:  Cleared the queue`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while clearing the queue. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
