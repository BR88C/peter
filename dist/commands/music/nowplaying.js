"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const lavalink_1 = require("@discord-rose/lavalink");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `nowplaying`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    interaction: {
        name: `nowplaying`,
        description: `Get the current music playing.`
    },
    exec: (ctx) => {
        let description;
        if (ctx.player.currentTrack.isStream)
            description = `🔴  **LIVE**`;
        else
            description = `\`\`\`\n${ctx.player.state === lavalink_1.PlayerState.PAUSED ? `⏸` : `▶`} ${discord_utils_1.Utils.timestamp(ctx.player.position ?? 0)} ${discord_utils_1.Utils.progressBar((ctx.player.position ?? 0) / (ctx.player.currentTrack.length ?? (ctx.player.position ?? 0)), 25)} ${discord_utils_1.Utils.timestamp(ctx.player.currentTrack.length ?? (ctx.player.position ?? 0))}\n\`\`\``;
        ctx.embed
            .color(Constants_1.default.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(discord_utils_1.Utils.cleanseMarkdown(ctx.player.currentTrack.title), ctx.player.currentTrack.uri)
            .thumbnail(ctx.player.currentTrack.thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${ctx.player.currentTrack.requester}`)
            .send()
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
