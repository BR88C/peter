import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `cointoss`,
    allowButton: true,
    interaction: {
        name: `cointoss`,
        description: `Tosses a coin, and returns heads or tails.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants.COIN_TOSS_EMBED_COLOR)
            .title(`The coin landed on ${Math.random() >= 0.5 ? `heads` : `tails`}!`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
