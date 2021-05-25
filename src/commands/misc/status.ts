import { Constants } from '../../config/Constants';
import { PresenceUpdateStatus } from 'discord-api-types';

// Import node modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `status`,
    exec: async (ctx) => {
        if (!Constants.PRESENCE_TYPES.includes(ctx.args[0])) void ctx.error(`Invalid status type`);
        else {
            await ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online` as PresenceUpdateStatus);
            ctx.embed
                .color(Constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send()
                .catch(async (error) => await ctx.error(error));
        }
    }
} as CommandOptions;
