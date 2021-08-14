import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `invite`,
    allowButton: true,
    interaction: {
        name: `invite`,
        description: `Gets the bot's invite link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants.INVITE_EMBED_COLOR)
            .title(`Invite link:`)
            .description(Constants.INVITE_LINK)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
