"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`ping`)
    .setDescription(`Displays the bot's ping`)
    .setExecute(async (ctx) => {
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.BLURPLE)
        .setTitle(`Ping`)
        .setDescription([
        `\`\`\``,
        `Gateway: ${Math.round(await ctx.client.gateway.getAveragePing())}ms`,
        `Lavalink: ${Math.round(await ctx.client.lavalink.averagePing())}ms`,
        `\`\`\``
    ].join(`\n`)));
});
