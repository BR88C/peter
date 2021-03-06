import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `vote`,
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
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
