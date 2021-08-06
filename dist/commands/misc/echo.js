"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../config/Config");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `echo`,
    exec: (ctx) => discord_utils_1.echoCommand(ctx, Config_1.Config.devs.IDs)
};
