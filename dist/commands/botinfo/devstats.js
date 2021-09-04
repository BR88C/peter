"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `devstats`,
    exec: (ctx) => discord_utils_1.Commands.devstats(ctx)
};
