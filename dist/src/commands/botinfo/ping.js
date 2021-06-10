"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `ping`,
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
            .catch((error) => void ctx.error(error));
    }
};
