"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
const Constants_1 = __importDefault(require("../../config/Constants"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `vote`,
    interaction: {
        name: `vote`,
        description: `Gets the bot's vote link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.default.VOTE_EMBED_COLOR)
            .title(`Vote Link:`)
            .description(Config_1.default.voteLink)
            .send()
            .catch((error) => {
            discord_utils_1.Utils.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
