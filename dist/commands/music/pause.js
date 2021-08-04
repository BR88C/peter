"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `pause`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: async (ctx) => {
        await ctx.player.pause();
        ctx.embed
            .color(Constants_1.Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
