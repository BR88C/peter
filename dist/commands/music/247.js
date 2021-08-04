"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `247`,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
    voteLocked: true,
    interaction: {
        name: `247`,
        description: `Toggle 24/7.`
    },
    exec: async (ctx) => {
        ctx.player.twentyfourseven = !ctx.player.twentyfourseven;
        if (ctx.player.loop === `off`)
            ctx.player.setLoop(`queue`);
        ctx.embed
            .color(Constants_1.Constants.TWENTY_FOUR_SEVEN_EMBED_COLOR)
            .title(`:clock2:  24/7 is now \`${ctx.player.twentyfourseven ? `On` : `Off`}\``)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
