import Config from '../../config/Config';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { echoCommand } from '@br88c/discord-utils';

export default {
    command: `echo`,
    exec: (ctx) => echoCommand(ctx, Config.devs.IDs)
} as CommandOptions;
