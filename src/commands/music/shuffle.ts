import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `shuffle`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `shuffle`,
        description: `Shuffles the queue, then plays the first track.`
    },
    exec: async (ctx) => {
        await ctx.player!.shuffle();

        ctx.embed
            .color(Constants.QUEUE_SHUFFLED_EMBED_COLOR)
            .title(`:twisted_rightwards_arrows:  Shuffled the queue`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
