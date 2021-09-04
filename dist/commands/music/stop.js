"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `stop`,
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
                .color(Constants_1.default.STOP_EMBED_COLOR)
                .title(`:octagonal_sign:  Stopped the music`)
                .send()
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`An unknown error occurred while stopping the music. Please submit an issue in our support server.`);
        });
    }
};
