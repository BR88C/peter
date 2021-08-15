"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `stop`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `stop`,
        description: `Stop the music.`
    },
    exec: (ctx) => {
        ctx.player.stop()
            .then(() => {
            ctx.embed
                .color(Constants_1.Constants.STOP_EMBED_COLOR)
                .title(`:octagonal_sign:  Stopped the music`)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`An unknown error occurred while stopping the music. Please submit an issue in our support server.`);
        });
    }
};
