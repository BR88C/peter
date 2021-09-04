"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
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
    exec: (ctx) => {
        ctx.player.resume()
            .then(() => {
            ctx.embed
                .color(Constants_1.default.PAUSE_RESUME_EMBED_COLOR)
                .title(`:arrow_forward:  Resumed the music`)
                .send()
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`An unknown error occurred while resuming the music. Please submit an issue in our support server.`);
        });
    }
};
