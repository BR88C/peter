import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`invite`)
    .setDescription(`Displays the bot's invite link`)
    .setExecute(async (ctx) => {
        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Invite Link:`)
                .setDescription(process.env.INVITE_LINK ?? `Invite Link Unavailable`)
        );
    });
