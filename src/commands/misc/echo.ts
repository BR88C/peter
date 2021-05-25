// Import node modules.
import { CommandOptions } from 'discord-rose'

export default {
    command: `echo`,
    exec: (ctx) => {
        ctx.delete().catch(() => {})
        ctx.send(ctx.args.join(` `))
    }
} as CommandOptions
