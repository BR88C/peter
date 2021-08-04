"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `resume`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePaused: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: async (ctx) => {
        await ctx.player.resume();
        ctx.embed
            .color(Constants_1.Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:arrow_forward:  Resumed the music`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
