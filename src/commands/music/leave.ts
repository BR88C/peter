import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `leave`,
    allowButton: true,
    mustHavePlayer: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `leave`,
        description: `Disconnect the bot from the voice channel and destroy the queue.`
    },
    exec: (ctx) => {
        ctx.player!.destroy();

        ctx.embed
            .color(Constants.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the voice channel`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
