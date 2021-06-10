"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `vote`,
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
            .catch((error) => void ctx.error(error));
    }
};
