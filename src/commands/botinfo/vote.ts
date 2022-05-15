import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`vote`)
    .setDescription(`Displays the bot's vote link`)
    .setExecute(async (ctx) => {
        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Vote Link:`)
                .setDescription(process.env.VOTE_LINK ?? `Vote Link Unavailable`)
        );
    });
