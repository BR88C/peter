import { Constants } from '../../config/Constants';

// Import modules.
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
            .description(`\`\`\`js\n${ctx.worker.guildShard(ctx.interaction.guild_id!).ping} ms\n\`\`\``)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
