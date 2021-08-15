"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `cointoss`,
    allowButton: true,
    interaction: {
        name: `cointoss`,
        description: `Tosses a coin, and returns heads or tails.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.Constants.COIN_TOSS_EMBED_COLOR)
            .title(`The coin landed on ${Math.random() >= 0.5 ? `heads` : `tails`}!`)
            .send()
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
