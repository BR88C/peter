"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
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
    exec: (ctx) => {
        if (!ctx.player.currentTrack.isSeekable || ctx.player.currentTrack.isStream)
            return void ctx.error(`The current song does not support seeking to the beginning of the song.`);
        ctx.player.seek(0)
            .then(() => {
            ctx.embed
                .color(Constants_1.default.SEEK_EMBED_COLOR)
                .title(`:rewind:  Seeked to the beginning of the song`)
                .send()
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`An unknown error occurred while seeking to the beginning of the song. Please submit an issue in our support server.`);
        });
    }
};
