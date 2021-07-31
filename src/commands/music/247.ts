import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `247`,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `247`,
        description: `Toggle 24/7.`
    },
    exec: async (ctx) => {
        ctx.player!.twentyfourseven = !ctx.player!.twentyfourseven;

        ctx.embed
            .color(Constants.TWENTY_FOUR_SEVEN_EMBED_COLOR)
            .title(`:clock2:  24/7 is now \`${ctx.player!.twentyfourseven ? `On` : `Off`}\``)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
