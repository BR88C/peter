"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `previous`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `previous`,
        description: `Skip to the previous song.`
    },
    exec: (ctx) => {
        if (!ctx.player.queue[(ctx.player.queuePosition ?? ctx.player.queue.length) - 1])
            return void ctx.error(`There are no previous songs to skip to.`);
        ctx.player.skip((ctx.player.queuePosition ?? ctx.player.queue.length) - 1)
            .then(() => {
            ctx.embed
                .color(Constants_1.Constants.SKIP_EMBED_COLOR)
                .title(`:track_previous:  Skipped to the previous song`)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`An unknown error occurred while skipping to the previous song. Please submit an issue in our support server.`);
        });
    }
};
