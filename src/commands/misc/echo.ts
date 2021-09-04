// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `echo`,
    exec: (ctx) => Commands.echo(ctx)
} as CommandOptions;
