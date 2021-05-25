import { Constants } from '../../config/Constants'

// Import node modules.
import { CommandOptions } from 'discord-rose'

export default {
    command: `cointoss`,
    interaction: {
        name: `cointoss`,
        description: `Tosses a coin, and returns heads or tails.`
    },
    exec: async (ctx) => {
        ctx.embed
            .color(Constants.COIN_TOSS_EMBED_COLOR)
            .title(`The coin landed on ${Math.random() >= 0.5 ? `heads` : `tails`}!`)
            .send()
    }
} as CommandOptions
