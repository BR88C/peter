import Config from '../../config/Config';
import { defaultTokenArray } from '../../utils/Tokens';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Commands } from '@br88c/discord-utils';

export default {
    command: `eval`,
    exec: async (ctx) => await Commands.eval(ctx, Config.devs.IDs, { tokens: ctx.worker.lavalink.spotifyToken
        ? defaultTokenArray.concat({
            token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
        })
        : defaultTokenArray })
} as CommandOptions;
