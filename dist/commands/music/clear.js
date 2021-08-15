"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `clear`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        ctx.player.clear()
            .then(() => {
            ctx.embed
                .color(Constants_1.Constants.QUEUE_CLEARED_EMBED_COLOR)
                .title(`:broom:  Cleared the queue`)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`An unknown error occurred while clearing the queue. Please submit an issue in our support server.`);
        });
    }
};
