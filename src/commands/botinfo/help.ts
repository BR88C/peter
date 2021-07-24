import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `help`,
    interaction: {
        name: `help`,
        description: `Get help using the bot.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants.INVITE_EMBED_COLOR)
            .title(`Join our support server to get help!`)
            .description(Constants.SUPPORT_SERVER)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
