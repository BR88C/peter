import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `vote`,
    allowButton: true,
    interaction: {
        name: `vote`,
        description: `Gets the bot's vote link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants.VOTE_EMBED_COLOR)
            .title(`Vote Link:`)
            .description(Constants.VOTE_LINK)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
