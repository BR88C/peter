"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `invite`,
    interaction: {
        name: `invite`,
        description: `Gets the bot's invite link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.Constants.INVITE_EMBED_COLOR)
            .title(`Invite link:`)
            .description(Constants_1.Constants.INVITE_LINK)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
