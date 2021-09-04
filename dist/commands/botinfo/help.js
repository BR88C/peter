"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `help`,
    interaction: {
        name: `help`,
        description: `Get help using the bot.`,
        options: [
            {
                type: 3,
                name: `command`,
                description: `The name of the command.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => await discord_utils_1.Commands.help(ctx)
};
