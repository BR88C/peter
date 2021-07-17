import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `status`,
    exec: (ctx) => {
        if (!Constants.PRESENCE_TYPES.includes(ctx.args[0])) void ctx.error(`Invalid status type.`);
        else {
            ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online`);
            ctx.embed
                .color(Constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send()
                .catch((error) => void ctx.error(error));
        }
    }
} as CommandOptions;
