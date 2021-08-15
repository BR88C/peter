"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../config/Config");
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `eval`,
    exec: async (ctx) => await discord_utils_1.evalCommand(ctx, Config_1.Config.devs.IDs, ctx.worker.lavalink.spotifyToken
        ? Config_1.Config.defaultTokenArray.concat({
            token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
        })
        : Config_1.Config.defaultTokenArray, Constants_1.Constants.EVAL_EMBED_COLOR)
};
