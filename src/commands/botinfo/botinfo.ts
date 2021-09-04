import Config from '../../config/Config';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `botinfo`,
    interaction: {
        name: `botinfo`,
        description: `Gets information about the bot.`
    },
    exec: async (ctx) => await Commands.botinfo(ctx, Config.devs.tags as unknown as string[])
} as CommandOptions;
