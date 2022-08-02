import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`ping`)
    .setDescription(`Displays the bot's ping`)
    .setExecute(async (ctx) => {
        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Ping`)
                .setDescription([
                    `\`\`\``,
                    `Gateway: ${Math.round(await ctx.client.gateway.getAveragePing())}ms`,
                    `Lavalink: ${Math.round(await ctx.client.lavalink.averagePing())}ms`,
                    `\`\`\``
                ].join(`\n`))
        );
    });
