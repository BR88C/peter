import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `shuffle`,
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
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
