import { Constants } from '../../config/Constants';

// Import node modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `invite`,
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
            .catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
