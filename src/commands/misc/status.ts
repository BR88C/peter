import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { DiscordConstants, logError } from '@br88c/discord-utils';

export default {
    command: `status`,
    exec: (ctx) => {
        if (!DiscordConstants.PRESENCE_TYPES.includes(ctx.args[0])) void ctx.error(`Invalid status type.`);
        else {
            ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online`);
            ctx.embed
                .color(Constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send()
                .catch((error) => {
                    logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
        }
    }
} as CommandOptions;
