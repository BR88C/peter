"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
const Tokens_1 = require("../../utils/Tokens");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `eval`,
    exec: async (ctx) => await discord_utils_1.Commands.eval(ctx, Config_1.default.devs.IDs, { tokens: ctx.worker.lavalink.spotifyToken
            ? Tokens_1.defaultTokenArray.concat({
                token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
            })
            : Tokens_1.defaultTokenArray })
};
