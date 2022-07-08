"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`invite`)
    .setDescription(`Displays the bot's invite link`)
    .setExecute(async (ctx) => {
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.BLURPLE)
        .setTitle(`Invite Link:`)
        .setDescription(process.env.INVITE_LINK ?? `Invite Link Unavailable`));
});
