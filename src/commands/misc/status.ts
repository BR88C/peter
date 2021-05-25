import { Constants } from '../../config/Constants'

// Import node modules.
import { CommandOptions } from 'discord-rose'

export default {
    command: `status`,
    exec: async (ctx) => {
        if (!Constants.PRESENCE_TYPES.includes(ctx.args[0])) ctx.error(`Invalid status type`);
        else {
            await ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online`);
            ctx.embed
                .color(Constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send()
        }
    }
} as CommandOptions
