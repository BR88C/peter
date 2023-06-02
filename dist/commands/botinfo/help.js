"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`help`)
    .setDescription(`Get Help`)
    .setExecute(async (ctx) => {
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.BLURPLE)
        .setTitle(`Help`)
        .setDescription([
        `Support Server: ${process.env.SUPPORT_SERVER?.length ? process.env.SUPPORT_SERVER : `\`Support Server Unavailable\``}`,
        `\`\`\``,
        `Commands:`,
        `\`\`\``
    ].join(`\n`)));
});
