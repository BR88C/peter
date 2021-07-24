"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `help`,
    interaction: {
        name: `help`,
        description: `Get help using the bot.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.Constants.INVITE_EMBED_COLOR)
            .title(`Join our support server to get help!`)
            .description(Constants_1.Constants.SUPPORT_SERVER)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
