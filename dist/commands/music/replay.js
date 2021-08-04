"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `replay`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `replay`,
        description: `Seek to the beginning of the song.`
    },
    exec: async (ctx) => {
        if (!ctx.player.currentTrack.isSeekable || ctx.player.currentTrack.isStream)
            return void ctx.error(`The current song does not support seeking to the beginning of the song.`);
        await ctx.player.seek(0);
        ctx.embed
            .color(Constants_1.Constants.SEEK_EMBED_COLOR)
            .title(`:rewind:  Seeked to the beginning of the song`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
