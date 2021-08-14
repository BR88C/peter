import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `previous`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `previous`,
        description: `Skip to the previous song.`
    },
    exec: async (ctx) => {
        if (!ctx.player!.queue[(ctx.player!.queuePosition ?? ctx.player!.queue.length) - 1]) return void ctx.error(`There are no previous songs to skip to.`);
        await ctx.player!.skip((ctx.player!.queuePosition ?? ctx.player!.queue.length) - 1);

        ctx.embed
            .color(Constants.SKIP_EMBED_COLOR)
            .title(`:track_previous:  Skipped to the previous song`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
