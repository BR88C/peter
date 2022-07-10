"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`vote`)
    .setDescription(`Displays the bot's vote link`)
    .setExecute(async (ctx) => {
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.BLURPLE)
        .setTitle(`Vote Link:`)
        .setDescription(process.env.VOTE_LINK?.length ? process.env.VOTE_LINK : `Vote Link Unavailable`));
});
