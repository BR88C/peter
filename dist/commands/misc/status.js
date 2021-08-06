"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `status`,
    exec: (ctx) => {
        if (!discord_utils_1.DiscordConstants.PRESENCE_TYPES.includes(ctx.args[0]))
            void ctx.error(`Invalid status type.`);
        else {
            ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online`);
            ctx.embed
                .color(Constants_1.Constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send()
                .catch(() => void ctx.error(`Unable to send the response message.`));
        }
    }
};
