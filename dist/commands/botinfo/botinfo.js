"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `botinfo`,
    interaction: {
        name: `botinfo`,
        description: `Gets information about the bot.`
    },
    exec: async (ctx) => await discord_utils_1.Commands.botinfo(ctx, Config_1.default.devs.tags)
};
