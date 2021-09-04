"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `leave`,
    mustHavePlayer: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `leave`,
        description: `Disconnect the bot from the voice channel and destroy the queue.`
    },
    exec: (ctx) => {
        ctx.player.destroy();
        ctx.embed
            .color(Constants_1.default.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the voice channel`)
            .send()
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
