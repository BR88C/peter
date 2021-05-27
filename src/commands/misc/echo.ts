// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `echo`,
    exec: (ctx) => {
        ctx.delete().catch(() => {});
        ctx.send(ctx.args.join(` `)).catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
