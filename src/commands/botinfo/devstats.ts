// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `devstats`,
    exec: (ctx) => Commands.devstats(ctx)
} as CommandOptions;
