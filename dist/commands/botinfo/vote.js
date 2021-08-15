"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `vote`,
    allowButton: true,
    interaction: {
        name: `vote`,
        description: `Gets the bot's vote link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.Constants.VOTE_EMBED_COLOR)
            .title(`Vote Link:`)
            .description(Constants_1.Constants.VOTE_LINK)
            .send()
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
