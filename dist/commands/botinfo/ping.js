"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `ping`,
    allowButton: true,
    interaction: {
        name: `ping`,
        description: `Gets the bot's ping.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(Constants_1.Constants.PING_EMBED_COLOR)
            .title(`Pong!`)
            .description(`\`\`\`js\n${ctx.worker.guildShard(ctx.interaction.guild_id).ping} ms\n\`\`\``)
            .send()
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
