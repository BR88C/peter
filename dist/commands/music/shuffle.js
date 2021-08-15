"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `shuffle`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `shuffle`,
        description: `Shuffles the queue, then plays the first track.`
    },
    exec: (ctx) => {
        ctx.player.shuffle()
            .then(() => {
            ctx.embed
                .color(Constants_1.Constants.QUEUE_SHUFFLED_EMBED_COLOR)
                .title(`:twisted_rightwards_arrows:  Shuffled the queue`)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`An unknown error occurred while pausing the music. Please submit an issue in our support server.`);
        });
    }
};
