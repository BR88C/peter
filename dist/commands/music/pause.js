"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
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
    exec: (ctx) => {
        ctx.player.pause()
            .then(() => {
            ctx.embed
                .color(Constants_1.default.PAUSE_RESUME_EMBED_COLOR)
                .title(`:pause_button:  Paused the music`)
                .send()
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`An unknown error occurred while pausing the music. Please submit an issue in our support server.`);
        });
    }
};
