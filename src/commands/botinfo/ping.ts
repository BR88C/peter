import { Constants } from '../../config/Constants';

// Import node modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `ping`,
    interaction: {
        name: `ping`,
        description: `Gets the bot's ping.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants.PING_EMBED_COLOR)
            .title(`Pong!`)
            .description(`\`\`\`js\n${ctx.worker.shards.find((shard) => shard.worker.guilds.has(ctx.interaction.guild_id))?.ping} ms\n\`\`\``)
            .send()
            .catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
