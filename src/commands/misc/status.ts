// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `status`,
    exec: (ctx) => Commands.status(ctx)
} as CommandOptions;
