"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `ping`,
    interaction: {
        name: `ping`,
        description: `Gets the bot's ping.`
    },
    exec: (ctx) => discord_utils_1.Commands.ping(ctx)
};
