// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `invite`,
    interaction: {
        name: `invite`,
        description: `Gets the bot's invite link.`
    },
    exec: async (ctx) => await Commands.invite(ctx)
} as CommandOptions;
