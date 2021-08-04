"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `shuffle`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `shuffle`,
        description: `Shuffles the queue, then plays the first track.`
    },
    exec: async (ctx) => {
        await ctx.player.shuffle();
        ctx.embed
            .color(Constants_1.Constants.QUEUE_SHUFFLED_EMBED_COLOR)
            .title(`:twisted_rightwards_arrows:  Shuffled the queue`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
