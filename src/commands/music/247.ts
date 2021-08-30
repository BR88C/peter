import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `247`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
    voteLocked: true,
    interaction: {
        name: `247`,
        description: `Toggle 24/7.`
    },
    exec: (ctx) => {
        ctx.player!.twentyfourseven = !ctx.player!.twentyfourseven;
        if (ctx.player!.loop === `off`) ctx.player!.setLoop(`queue`);

        ctx.embed
            .color(Constants.TWENTY_FOUR_SEVEN_EMBED_COLOR)
            .title(`:clock2:  24/7 is now \`${ctx.player!.twentyfourseven ? `On` : `Off`}\``)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
