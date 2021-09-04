"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `invite`,
    interaction: {
        name: `invite`,
        description: `Gets the bot's invite link.`
    },
    exec: async (ctx) => await discord_utils_1.Commands.invite(ctx)
};
