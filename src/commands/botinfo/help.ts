// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `help`,
    interaction: {
        name: `help`,
        description: `Get help using the bot.`,
        options: [
            {
                type: 3,
                name: `command`,
                description: `The name of the command.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => await Commands.help(ctx)
} as CommandOptions;
