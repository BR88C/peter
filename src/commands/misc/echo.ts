// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `echo`,
    exec: (ctx) => {
        ctx.delete().catch(() => {});
        ctx.send(ctx.args.join(` `)).catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
