import Config from '../../config/Config';
import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { evalCommand } from '@br88c/discord-utils';

export default {
    command: `eval`,
    exec: async (ctx) => await evalCommand(ctx, Config.devs.IDs, ctx.worker.lavalink.spotifyToken
        ? Config.defaultTokenArray.concat({
            token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
        })
        : Config.defaultTokenArray, Constants.EVAL_EMBED_COLOR)
} as CommandOptions;
