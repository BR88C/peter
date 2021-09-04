"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `247`,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
    voteLocked: true,
    interaction: {
        name: `247`,
        description: `Toggle 24/7.`
    },
    exec: (ctx) => {
        ctx.player.twentyfourseven = !ctx.player.twentyfourseven;
        if (ctx.player.loop === `off`)
            ctx.player.setLoop(`queue`);
        ctx.embed
            .color(Constants_1.default.TWENTY_FOUR_SEVEN_EMBED_COLOR)
            .title(`:clock2:  24/7 is now \`${ctx.player.twentyfourseven ? `On` : `Off`}\``)
            .send()
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
