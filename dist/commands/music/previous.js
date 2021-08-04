"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `previous`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `previous`,
        description: `Skip to the previous song.`
    },
    exec: async (ctx) => {
        if (!ctx.player.queue[(ctx.player.queuePosition ?? ctx.player.queue.length) - 1])
            return void ctx.error(`There are no previous songs to skip to.`);
        await ctx.player.skip((ctx.player.queuePosition ?? ctx.player.queue.length) - 1);
        ctx.embed
            .color(Constants_1.Constants.SKIP_EMBED_COLOR)
            .title(`:track_previous:  Skipped to the previous song`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
