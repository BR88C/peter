import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `ping`,
    allowButton: true,
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
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
