"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `seek`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `seek`,
        description: `Seek to a position in the song.`,
        options: [
            {
                type: 4,
                name: `time`,
                description: `The time in seconds to seek to.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (!ctx.player.queue[ctx.player.queuePosition ?? 0].isSeekable || ctx.player.queue[ctx.player.queuePosition ?? 0].isStream)
            return void ctx.error(`The current song does not support seeking.`);
        if (ctx.options.time < 0)
            return void ctx.error(`Invalid value to seek to.`);
        await ctx.player.seek(ctx.options.time * 1e3);
        ctx.embed
            .color(Constants_1.Constants.SEEK_EMBED_COLOR)
            .title(`:fast_forward:  Seeked to ${discord_utils_1.timestamp(ctx.options.time * 1e3)}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
