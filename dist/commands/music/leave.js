"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
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
            .color(Constants_1.Constants.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the voice channel`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
